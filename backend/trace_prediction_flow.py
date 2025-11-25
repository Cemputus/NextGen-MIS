"""Trace the exact prediction flow to find where 'M' is being converted to float"""
import sys
from pathlib import Path
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from config import DATA_WAREHOUSE_CONN_STRING
import pandas as pd
import numpy as np
from ml_models import MultiModelPredictor

def trace_prediction():
    """Trace through the prediction flow step by step"""
    print("="*80)
    print("TRACING PREDICTION FLOW")
    print("="*80)
    
    # Get a sample student
    engine = create_engine(DATA_WAREHOUSE_CONN_STRING)
    sample_student = pd.read_sql_query(
        text("SELECT student_id FROM dim_student WHERE access_number = 'A26143' LIMIT 1"),
        engine
    )
    
    if sample_student.empty:
        print("No sample student found")
        return
    
    student_id = sample_student['student_id'].iloc[0]
    print(f"\nUsing student_id: {student_id}")
    
    # Step 1: Run the exact query from ml_models.py
    print("\n" + "="*80)
    print("STEP 1: Running prediction query from ml_models.py")
    print("="*80)
    
    query = text("""
    SELECT 
        ds.student_id,
        ds.gender,
        ds.nationality,
        ds.high_school,
        ds.high_school_district,
        YEAR(ds.admission_date) as admission_year,
        YEAR(CURDATE()) - YEAR(ds.admission_date) as years_at_university,
        ds.program_id,
        ds.year_of_study,
        COALESCE(SUM(fa.total_hours), 0) as total_attendance_hours,
        COALESCE(SUM(fa.days_present), 0) as total_days_present,
        COALESCE(COUNT(DISTINCT fa.course_code), 0) as courses_attended,
        COALESCE(AVG(fa.total_hours), 0) as avg_hours_per_course,
        COALESCE(COUNT(*), 0) as total_attendance_records,
        CASE 
            WHEN COUNT(*) > 0 
            THEN (SUM(fa.days_present) / COUNT(*)) * 100
            ELSE 0 
        END as attendance_rate,
        COALESCE(SUM(CASE WHEN fp.status = 'Completed' THEN fp.amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN fp.status = 'Pending' THEN fp.amount ELSE 0 END), 0) as total_pending,
        COALESCE(SUM(fp.amount), 0) as total_required,
        COALESCE(COUNT(CASE WHEN fp.status = 'Completed' THEN 1 END), 0) as payment_count,
        COALESCE(AVG(CASE WHEN fp.status = 'Completed' THEN fp.amount ELSE 0 END), 0) as avg_payment,
        CASE 
            WHEN SUM(fp.amount) > 0 
            THEN SUM(CASE WHEN fp.status = 'Completed' THEN fp.amount ELSE 0 END) / SUM(fp.amount) * 100
            ELSE 0 
        END as payment_completion_rate,
        CASE 
            WHEN SUM(CASE WHEN fp.status = 'Pending' THEN fp.amount ELSE 0 END) > 500000 
            THEN 1 ELSE 0 
        END as has_significant_balance,
        COALESCE(COUNT(DISTINCT fe.course_code), 0) as total_enrollments,
        COALESCE(COUNT(DISTINCT fe.semester_id), 0) as semesters_enrolled,
        COALESCE(AVG(dc.credits), 0) as avg_course_credits,
        COALESCE(SUM(dc.credits), 0) as total_credits,
        COALESCE(COUNT(CASE WHEN fg.exam_status = 'MEX' THEN 1 END), 0) as missed_exams,
        COALESCE(COUNT(CASE WHEN fg.exam_status = 'FEX' THEN 1 END), 0) as failed_exams,
        COALESCE(COUNT(CASE WHEN fg.exam_status = 'FCW' THEN 1 END), 0) as failed_coursework,
        COALESCE(AVG(fg.coursework_score), 0) as avg_coursework_score,
        COALESCE(AVG(fg.exam_score), 0) as avg_exam_score
    FROM dim_student ds
    LEFT JOIN fact_attendance fa ON ds.student_id = fa.student_id
    LEFT JOIN fact_payment fp ON ds.student_id = fp.student_id
    LEFT JOIN fact_enrollment fe ON ds.student_id = fe.student_id
    LEFT JOIN dim_course dc ON fe.course_code = dc.course_code
    LEFT JOIN fact_grade fg ON ds.student_id = fg.student_id
    WHERE ds.student_id = :student_id
    GROUP BY ds.student_id, ds.gender, ds.nationality, ds.high_school, ds.high_school_district, ds.admission_date, ds.program_id, ds.year_of_study
    """)
    
    student_data = pd.read_sql_query(query, engine, params={'student_id': student_id})
    engine.dispose()
    
    print(f"\nQuery returned {len(student_data)} rows")
    print("\nRaw data from query:")
    print(student_data.to_string())
    print("\nData types:")
    print(student_data.dtypes)
    
    # Step 2: Check for 'M' values
    print("\n" + "="*80)
    print("STEP 2: Checking for 'M' values in raw data")
    print("="*80)
    
    for col in student_data.columns:
        col_data = student_data[col]
        if col_data.dtype == 'object':
            unique_vals = col_data.unique()
            print(f"\n{col} (object type):")
            print(f"  Unique values: {unique_vals[:10]}")
            if 'M' in [str(v) for v in unique_vals]:
                print(f"  *** FOUND 'M' IN {col} ***")
                print(f"  Values: {col_data.value_counts().head()}")
    
    # Step 3: Encode categorical variables
    print("\n" + "="*80)
    print("STEP 3: Encoding categorical variables")
    print("="*80)
    
    student_data['gender_encoded'] = student_data['gender'].map({'M': 1, 'F': 0}).fillna(0)
    student_data['nationality_encoded'] = pd.Categorical(student_data['nationality']).codes
    student_data['high_school_encoded'] = pd.Categorical(student_data['high_school']).codes
    student_data['high_school_district_encoded'] = pd.Categorical(student_data['high_school_district']).codes
    
    print("\nAfter encoding:")
    print(f"gender_encoded: {student_data['gender_encoded'].values}")
    print(f"nationality_encoded: {student_data['nationality_encoded'].values}")
    
    # Step 4: Try to load model and get feature columns
    print("\n" + "="*80)
    print("STEP 4: Loading model and checking feature columns")
    print("="*80)
    
    try:
        predictor = MultiModelPredictor()
        predictor.load_models()
        
        if predictor.feature_cols:
            print(f"\nModel has {len(predictor.feature_cols)} feature columns")
            print(f"Feature columns: {predictor.feature_cols[:10]}...")
            
            # Step 5: Prepare feature vector
            print("\n" + "="*80)
            print("STEP 5: Preparing feature vector")
            print("="*80)
            
            available_cols = [col for col in predictor.feature_cols if col in student_data.columns]
            print(f"\nAvailable columns: {len(available_cols)}")
            print(f"Missing columns: {set(predictor.feature_cols) - set(student_data.columns)}")
            
            X_df = student_data[available_cols].copy()
            print(f"\nX_df shape: {X_df.shape}")
            print(f"X_df dtypes:\n{X_df.dtypes}")
            
            # Check each column for 'M' values
            print("\nChecking each column for problematic values:")
            for col in X_df.columns:
                if X_df[col].dtype == 'object':
                    unique_vals = X_df[col].unique()
                    print(f"  {col}: {unique_vals[:5]} (object type)")
                    if any('M' in str(v) for v in unique_vals):
                        print(f"    *** FOUND 'M' IN {col} ***")
                else:
                    # Check if numeric column has any non-numeric values
                    try:
                        pd.to_numeric(X_df[col], errors='raise')
                    except (ValueError, TypeError) as e:
                        print(f"  {col}: ERROR - {e}")
                        print(f"    Sample values: {X_df[col].head().tolist()}")
            
            # Try conversion
            print("\n" + "="*80)
            print("STEP 6: Converting to numeric")
            print("="*80)
            
            for col in X_df.columns:
                if X_df[col].dtype == 'object' or X_df[col].dtype == 'string':
                    print(f"\nConverting {col} (current type: {X_df[col].dtype})")
                    print(f"  Sample values before: {X_df[col].head().tolist()}")
                    X_df[col] = X_df[col].astype(str).replace(['M', 'm', 'N/A', 'n/a', 'NULL', 'null', 'NONE', 'none', '', 'nan', 'NaN', 'None'], '0')
                    X_df[col] = pd.to_numeric(X_df[col], errors='coerce').fillna(0)
                    print(f"  Sample values after: {X_df[col].head().tolist()}")
                else:
                    X_df[col] = pd.to_numeric(X_df[col], errors='coerce').fillna(0)
            
            # Try to convert to array
            print("\n" + "="*80)
            print("STEP 7: Converting to numpy array")
            print("="*80)
            
            try:
                X = X_df.values.astype(np.float64)
                print(f"Success! X shape: {X.shape}, dtype: {X.dtype}")
            except (ValueError, TypeError) as e:
                print(f"ERROR converting to float64: {e}")
                print(f"X_df dtypes:\n{X_df.dtypes}")
                print(f"X_df sample:\n{X_df.head()}")
                raise
            
            # Try scaling
            print("\n" + "="*80)
            print("STEP 8: Scaling features")
            print("="*80)
            
            try:
                X_scaled = predictor.scaler.transform(X)
                print(f"Success! X_scaled shape: {X_scaled.shape}")
            except Exception as e:
                print(f"ERROR in scaler.transform: {e}")
                print(f"X dtype: {X.dtype}")
                print(f"X sample: {X[0] if len(X) > 0 else 'empty'}")
                raise
            
        else:
            print("Model not trained - no feature columns available")
            
    except Exception as e:
        print(f"\nERROR during prediction: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    trace_prediction()

