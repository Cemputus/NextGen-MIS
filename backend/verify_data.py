"""Verify that data was loaded correctly with new fields"""
from config import DATA_WAREHOUSE_CONN_STRING, DB1_CONN_STRING
import pandas as pd
from sqlalchemy import create_engine

print("=" * 60)
print("DATA VERIFICATION")
print("=" * 60)

# Check Data Warehouse
engine = create_engine(DATA_WAREHOUSE_CONN_STRING)
print("\n=== Data Warehouse Summary ===")
result = pd.read_sql_query("SELECT COUNT(*) as count FROM dim_faculty", engine)
print(f"Faculties: {result['count'][0]}")
result = pd.read_sql_query("SELECT COUNT(*) as count FROM dim_program", engine)
print(f"Programs: {result['count'][0]}")
result = pd.read_sql_query("SELECT COUNT(*) as count FROM fact_payment", engine)
print(f"Payments: {result['count'][0]}")

print("\n=== Payment Summary by Year ===")
result = pd.read_sql_query("""
    SELECT year, COUNT(*) as count, 
           SUM(tuition_national) as total_nat, 
           SUM(tuition_international) as total_int, 
           SUM(functional_fees) as total_func 
    FROM fact_payment 
    GROUP BY year
""", engine)
print(result.to_string())

print("\n=== Sample Programs with Tuition (from Source DB) ===")
engine_db1 = create_engine(DB1_CONN_STRING)
result = pd.read_sql_query("""
    SELECT ProgramName, TuitionNationals, TuitionNonNationals, DegreeLevel
    FROM programs 
    LIMIT 10
""", engine_db1)
print(result.to_string())

print("\n=== Sample Payments with Fee Breakdown ===")
result = pd.read_sql_query("""
    SELECT payment_id, student_id, year, semester_id,
           tuition_national, tuition_international, functional_fees, amount, status
    FROM fact_payment 
    LIMIT 5
""", engine)
print(result.to_string())

print("\n=== UCU Semester Names ===")
result = pd.read_sql_query("SELECT * FROM dim_semester", engine)
print(result.to_string())

engine.dispose()
engine_db1.dispose()
print("\n✓ Verification complete!")

