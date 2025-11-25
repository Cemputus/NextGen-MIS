"""Debug script to trace where 'M' string values are coming from in predictions"""
from sqlalchemy import create_engine, text
from config import DATA_WAREHOUSE_CONN_STRING
import pandas as pd
import numpy as np

def check_database_for_m_values():
    """Check database for 'M' values in relevant columns"""
    engine = create_engine(DATA_WAREHOUSE_CONN_STRING)
    
    print("="*80)
    print("CHECKING DATABASE FOR 'M' VALUES")
    print("="*80)
    
    # Check fact_grade table
    queries = [
        ("fact_grade - coursework_score", 
         "SELECT COUNT(*) as count, coursework_score FROM fact_grade WHERE coursework_score = 'M' OR coursework_score LIKE '%M%' GROUP BY coursework_score LIMIT 10"),
        ("fact_grade - exam_score", 
         "SELECT COUNT(*) as count, exam_score FROM fact_grade WHERE exam_score = 'M' OR exam_score LIKE '%M%' GROUP BY exam_score LIMIT 10"),
        ("fact_grade - grade", 
         "SELECT COUNT(*) as count, grade FROM fact_grade WHERE grade = 'M' OR grade LIKE '%M%' GROUP BY grade LIMIT 10"),
        ("Sample fact_grade rows with M", 
         "SELECT student_id, course_code, coursework_score, exam_score, grade, exam_status FROM fact_grade WHERE coursework_score = 'M' OR exam_score = 'M' OR grade = 'M' LIMIT 5"),
    ]
    
    for name, query_str in queries:
        try:
            df = pd.read_sql_query(text(query_str), engine)
            print(f"\n{name}:")
            if not df.empty:
                print(df.to_string())
            else:
                print("  No 'M' values found")
        except Exception as e:
            print(f"  Error: {e}")
    
    # Check what AVG returns when there are 'M' values
    print("\n" + "="*80)
    print("TESTING SQL AVG WITH 'M' VALUES")
    print("="*80)
    
    test_query = text("""
    SELECT 
        student_id,
        AVG(CASE WHEN coursework_score != 'M' AND coursework_score IS NOT NULL THEN CAST(coursework_score AS DECIMAL(10,2)) ELSE NULL END) as avg_coursework_safe,
        AVG(CAST(coursework_score AS DECIMAL(10,2))) as avg_coursework_unsafe,
        AVG(coursework_score) as avg_coursework_raw
    FROM fact_grade 
    WHERE student_id IN (SELECT student_id FROM fact_grade WHERE coursework_score = 'M' LIMIT 1)
    GROUP BY student_id
    LIMIT 1
    """)
    
    try:
        df = pd.read_sql_query(test_query, engine)
        print("\nAVG test results:")
        print(df.to_string())
        print(f"\nData types:")
        print(df.dtypes)
    except Exception as e:
        print(f"Error testing AVG: {e}")
    
    # Test the actual prediction query
    print("\n" + "="*80)
    print("TESTING ACTUAL PREDICTION QUERY")
    print("="*80)
    
    # Get a sample student
    sample_student = pd.read_sql_query(
        text("SELECT student_id FROM dim_student WHERE access_number = 'A26143' LIMIT 1"),
        engine
    )
    
    if not sample_student.empty:
        student_id = sample_student['student_id'].iloc[0]
        print(f"\nTesting with student_id: {student_id}")
        
        prediction_query = text("""
        SELECT 
            ds.student_id,
            COALESCE(AVG(fg.coursework_score), 0) as avg_coursework_score,
            COALESCE(AVG(fg.exam_score), 0) as avg_exam_score
        FROM dim_student ds
        LEFT JOIN fact_grade fg ON ds.student_id = fg.student_id
        WHERE ds.student_id = :student_id
        GROUP BY ds.student_id
        """)
        
        df = pd.read_sql_query(prediction_query, engine, params={'student_id': student_id})
        print("\nPrediction query result:")
        print(df.to_string())
        print(f"\nData types:")
        print(df.dtypes)
        print(f"\nValues:")
        for col in df.columns:
            val = df[col].iloc[0]
            print(f"  {col}: {val} (type: {type(val).__name__})")
            if isinstance(val, str):
                print(f"    WARNING: {col} is a STRING!")
    
    engine.dispose()

if __name__ == "__main__":
    check_database_for_m_values()

