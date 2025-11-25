# UCU Analytics & Prediction System

A comprehensive data analytics and machine learning platform for Uganda Christian University (UCU), designed to provide insights into student performance, attendance, payment patterns, and predictive analytics for academic success.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Machine Learning Models](#machine-learning-models)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [ETL Pipeline](#etl-pipeline)
- [Security & RBAC](#security--rbac)
- [Frontend Dashboard](#frontend-dashboard)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

The UCU Analytics & Prediction System is a full-stack web application that provides:

- **Real-time Analytics**: Comprehensive dashboards for students, faculty, and administrators
- **Predictive Analytics**: ML-powered predictions for student performance, attendance, and payment patterns
- **Role-Based Access Control**: Secure multi-role system (Student, Staff, HOD, Dean, Senate, Finance)
- **Data Warehousing**: Star schema data warehouse for efficient analytics
- **ETL Pipeline**: Automated data extraction, transformation, and loading from source systems

---

## 🏗️ Architecture

### System Components

```
┌─────────────────┐
│   Frontend      │  React.js + Tailwind CSS + SciChart.js
│   (React)       │
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│   Backend API   │  Flask + JWT Authentication
│   (Flask)       │
└────────┬────────┘
         │ SQL
┌────────▼────────┐
│  Data Warehouse │  MySQL (Star Schema)
│  (MySQL)        │
└────────┬────────┘
         │
┌────────▼────────┐
│  Source Data    │  CSV Files / Source DB
│  (Bronze)       │
└─────────────────┘
```

### Data Flow

1. **ETL Pipeline** extracts data from source systems (CSV files)
2. Data is transformed and loaded into **Bronze** (raw), **Silver** (cleaned), and **Gold** (aggregated) layers
3. **Data Warehouse** (Star Schema) stores dimension and fact tables
4. **Backend API** queries the warehouse and serves analytics
5. **ML Models** are trained on warehouse data and provide predictions
6. **Frontend** displays dashboards and visualizations

---

## ✨ Key Features

### 1. **Multi-Role Dashboards**
- **Student Dashboard**: Personal performance, attendance, payment status
- **Staff Dashboard**: Class-level analytics and student management
- **HOD Dashboard**: Department-wide insights and trends
- **Dean Dashboard**: Faculty-level analytics and performance metrics
- **Senate Dashboard**: University-wide statistics and trends
- **Finance Dashboard**: Payment tracking, revenue analysis, and financial reports

### 2. **Advanced Analytics**
- **FEX Analytics**: Failed Exam analysis with drill-down capabilities
- **High School Analytics**: Enrollment patterns, retention rates, and performance by high school
- **Payment Analytics**: Payment trends, completion rates, and outstanding balances
- **Attendance Analytics**: Attendance patterns and correlation with performance

### 3. **Predictive Analytics**
- Student performance prediction
- Tuition-attendance-performance correlation
- Scenario analysis (what-if predictions)
- Batch predictions for multiple students

### 4. **Data Export**
- Excel export for all analytics
- PDF report generation
- Customizable filters and date ranges

---

## 🤖 Machine Learning Models

### 1. **Standard Performance Prediction Models**

#### **Random Forest Regressor**
- **Purpose**: Predict student average grade based on historical data
- **Why Used**: 
  - Handles non-linear relationships well
  - Robust to outliers
  - Provides feature importance
  - Good performance with mixed data types
- **Features**: 42 features including demographics, attendance, payments, grades, high school metrics
- **Performance**: R² = 0.9992, RMSE = 0.71

#### **Gradient Boosting Regressor**
- **Purpose**: Alternative ensemble method for performance prediction
- **Why Used**:
  - Sequential learning improves accuracy
  - Better handling of complex patterns
  - Strong performance on regression tasks
- **Performance**: R² = 0.9995, RMSE = 0.59 (Best performing)

#### **Neural Network (MLPRegressor)**
- **Purpose**: Deep learning approach for performance prediction
- **Why Used**:
  - Captures complex non-linear relationships
  - Good for large feature spaces
  - Can learn hierarchical patterns
- **Performance**: R² = 0.9961, RMSE = 1.58

**Model Selection**: The system uses an ensemble approach, averaging predictions from all three models for maximum accuracy.

---

### 2. **Enhanced Prediction Models**

#### **Tuition-Attendance-Performance Model**
- **Type**: Gradient Boosting Regressor
- **Purpose**: Predict student performance based on tuition payment timeliness and attendance patterns
- **Why Used**:
  - Identifies at-risk students early
  - Helps financial aid and academic support teams intervene proactively
  - Combines financial and behavioral indicators
- **Features**:
  - Payment completion rate
  - Total paid/pending amounts
  - Completed payments count
  - Days since last payment
  - Attendance rate
  - Total attendance hours
  - Courses attended
  - Combined attendance-payment score
- **Use Case**: Early intervention for students with payment delays and poor attendance

#### **Enrollment Trend Model**
- **Type**: Random Forest Regressor
- **Purpose**: Predict enrollment trends for resource allocation
- **Why Used**:
  - Helps plan course offerings
  - Optimizes resource allocation (classrooms, faculty)
  - Identifies enrollment patterns by program/department
- **Features**: Year, quarter, program, department, faculty, historical enrollment data, lag features

#### **Foundational Course Performance Model**
- **Type**: Gradient Boosting Regressor
- **Purpose**: Predict performance in foundational courses
- **Why Used**:
  - Identifies students struggling with core courses
  - Helps design intervention programs
  - Predicts success in advanced courses
- **Features**: Course characteristics, student background, previous performance

---

### 3. **Model Training & Evaluation**

**Training Process**:
1. Data extraction from data warehouse
2. Feature engineering and selection
3. Train-test split (80/20)
4. Feature scaling (StandardScaler)
5. Model training with cross-validation
6. Model evaluation (R², RMSE, MAE)
7. Model persistence (pickle files)

**Model Storage**:
- Standard models: `backend/models/multi_model_predictor.pkl`
- Enhanced models: `backend/models/enhanced_predictor.pkl`

**Retraining**: Models can be retrained using:
```bash
cd backend
python train_models.py
```

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL 8.0+
- **ORM**: SQLAlchemy
- **Authentication**: Flask-JWT-Extended
- **ML Libraries**: scikit-learn, pandas, numpy
- **Data Processing**: pandas, numpy

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Charts**: SciChart.js (primary), Recharts (fallback)
- **Icons**: Lucide React
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Data Pipeline
- **ETL**: Custom Python pipeline
- **Data Layers**: Bronze (raw), Silver (cleaned), Gold (aggregated)
- **Warehouse**: Star Schema (Dimensions + Facts)

### Infrastructure
- **Server**: Flask development server (production: Gunicorn recommended)
- **Database**: MySQL with InnoDB engine
- **File Storage**: Local filesystem (CSV, PDF exports)

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd "final year project"
```

2. **Set up Python virtual environment**
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure database**
- Edit `backend/config.py` with your MySQL credentials:
```python
MYSQL_HOST = 'localhost'
MYSQL_USER = 'your_username'
MYSQL_PASSWORD = 'your_password'
MYSQL_DATABASE = 'UCU_DataWarehouse'
```

5. **Create database and run ETL**
```bash
# Create database schema
python setup_databases.py

# Run ETL pipeline
python etl_pipeline.py
```

6. **Train ML models**
```bash
python train_models.py
```

7. **Start backend server**
```bash
python app.py
# Or use the batch file
start_backend.bat
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### Quick Start (Windows)

Use the provided batch files:
```bash
# Start both backend and frontend
start_all_services.bat

# Or start individually
start_backend.bat
# Then in another terminal:
cd frontend && npm start
```

---

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "dean",
  "password": "dean123"
}
```

**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "username": "dean",
    "role": "Dean",
    "faculty_id": 1
  }
}
```

### Dashboard Endpoints

All dashboard endpoints require JWT authentication. Include token in header:
```http
Authorization: Bearer <access_token>
```

#### Dashboard Statistics
```http
GET /api/dashboard/stats
```

Returns: Total students, courses, average grade, payment statistics

#### Payment Trends
```http
GET /api/dashboard/payment-trends
```

Returns: Payment trends over time (Finance role only)

#### Grade Distribution
```http
GET /api/dashboard/grade-distribution
```

Returns: Distribution of grades across the system

### Analytics Endpoints

#### FEX Analytics
```http
GET /api/analytics/fex?drilldown=overall
```

**Drilldown options**: `overall`, `faculty`, `department`, `program`, `course`

#### High School Analytics
```http
GET /api/analytics/high-school
```

Returns: Enrollment, retention, and performance by high school

### Prediction Endpoints

#### Student Performance Prediction
```http
POST /api/predictions/predict
Content-Type: application/json
Authorization: Bearer <token>

{
  "student_id": "J21B05/001",
  "model_type": "ensemble"
}
```

**Response**:
```json
{
  "student_id": "J21B05/001",
  "predicted_grade": 75.5,
  "predicted_letter_grade": "B+",
  "confidence": 0.95
}
```

#### Tuition-Attendance-Performance Prediction
```http
POST /api/predictions/tuition-attendance-performance
Content-Type: application/json
Authorization: Bearer <token>

{
  "student_id": "J21B05/001"
}
```

#### Scenario Analysis
```http
POST /api/predictions/scenario
Content-Type: application/json
Authorization: Bearer <token>

{
  "student_id": "J21B05/001",
  "scenarios": [
    {
      "name": "Improved Attendance",
      "attendance_rate": 90,
      "payment_completion_rate": 100
    }
  ]
}
```

### Export Endpoints

#### Excel Export
```http
GET /api/export/excel?type=dashboard&faculty_id=1
```

#### PDF Export
```http
GET /api/export/pdf?type=fex&department_id=5
```

---

## 🗄️ Database Schema

### Star Schema Design

#### Dimension Tables

**dim_student**
- `student_id` (PK)
- `access_number`, `reg_no`
- `first_name`, `last_name`, `email`
- `gender`, `nationality`
- `admission_date`
- `high_school`, `high_school_district`
- `program_id`, `year_of_study`, `status`

**dim_course**
- `course_code` (PK)
- `course_name`
- `credits`
- `department`

**dim_time**
- `date_key` (PK) - Format: YYYYMMDD
- `date`, `year`, `quarter`, `month`
- `month_name`, `day`, `day_of_week`, `day_name`
- `is_weekend`

**dim_semester**
- `semester_id` (PK)
- `semester_name`
- `academic_year`

**dim_program**
- `program_id` (PK)
- `program_name`
- `degree_level`
- `department_id` (FK)
- `duration_years`

**dim_department**
- `department_id` (PK)
- `department_name`
- `faculty_id` (FK)
- `head_of_department`

**dim_faculty**
- `faculty_id` (PK)
- `faculty_name`
- `dean_name`

#### Fact Tables

**fact_enrollment**
- `enrollment_id` (PK)
- `student_id` (FK)
- `course_code` (FK)
- `date_key` (FK)
- `semester_id` (FK)
- `status`

**fact_attendance**
- `attendance_id` (PK)
- `student_id` (FK)
- `course_code` (FK)
- `date_key` (FK)
- `total_hours`
- `days_present`
- `days_absent`

**fact_payment**
- `payment_id` (PK)
- `student_id` (FK)
- `date_key` (FK)
- `amount`
- `status` (Completed/Pending/Failed)
- `payment_type` (Tuition/Functional Fees)

**fact_grade**
- `grade_id` (PK)
- `student_id` (FK)
- `course_code` (FK)
- `date_key` (FK)
- `coursework_score`
- `exam_score`
- `grade`
- `exam_status` (Completed/MEX/FEX/FCW)
- `absence_reason`

---

## 🔄 ETL Pipeline

### Data Flow

```
Source Data (CSV)
    ↓
Bronze Layer (Raw Data)
    ↓
Silver Layer (Cleaned Data)
    ↓
Gold Layer (Aggregated Data)
    ↓
Data Warehouse (Star Schema)
```

### ETL Process

1. **Extract**: Read CSV files from `backend/data/source_data*.csv`
2. **Transform**:
   - Data cleaning (handle missing values, duplicates)
   - Data type conversion
   - Standardization (names, dates, formats)
   - Data validation
3. **Load**:
   - Create dimension tables
   - Populate fact tables
   - Create indexes for performance
   - Set up foreign key relationships

### Running ETL

```bash
cd backend
python etl_pipeline.py
```

ETL logs are saved in `backend/logs/etl_pipeline_*.log`

---

## 🔐 Security & RBAC

### Role-Based Access Control (RBAC)

The system implements a comprehensive RBAC system with the following roles:

#### Roles & Permissions

1. **Student**
   - View own performance, attendance, payments
   - Access personal predictions
   - No administrative access

2. **Staff**
   - View class-level analytics
   - Access students in assigned courses
   - Limited prediction access

3. **HOD (Head of Department)**
   - View department-wide analytics
   - Access all students in department
   - Department-level predictions

4. **Dean**
   - View faculty-wide analytics
   - Access all students in faculty
   - Faculty-level predictions and reports

5. **Senate**
   - Full system access
   - University-wide analytics
   - All predictions and reports
   - System administration

6. **Finance**
   - Payment analytics and reports
   - Financial predictions
   - Payment tracking

### Authentication

- **JWT Tokens**: Access tokens (24h expiry) and refresh tokens (30 days)
- **Password Hashing**: bcrypt for secure password storage
- **Token Refresh**: Automatic token refresh mechanism

### Data Scoping

All queries are automatically scoped based on user role:
- Students see only their data
- Staff see their class data
- HOD sees department data
- Dean sees faculty data
- Senate sees all data

---

## 🎨 Frontend Dashboard

### Dashboard Components

1. **Student Dashboard**
   - Personal performance metrics
   - Attendance calendar
   - Payment status
   - Grade history
   - Performance predictions

2. **Staff Dashboard**
   - Class performance overview
   - Student list with filters
   - Attendance tracking
   - Grade entry interface

3. **HOD Dashboard**
   - Department statistics
   - Program performance
   - Student distribution
   - Department trends

4. **Dean Dashboard**
   - Faculty-wide metrics
   - Program comparisons
   - High school analytics
   - Faculty performance reports

5. **Senate Dashboard**
   - University-wide statistics
   - Cross-faculty comparisons
   - Enrollment trends
   - System-wide analytics

6. **Finance Dashboard**
   - Payment tracking
   - Revenue analytics
   - Outstanding balances
   - Payment trends

### Chart Library

- **Primary**: SciChart.js (high-performance charts)
- **Fallback**: Recharts (if SciChart fails to load)
- **Chart Types**: Line, Bar, Area, Stacked Column, Pie (via stacked column)

---

## 💡 Usage Examples

### Example 1: Predict Student Performance

```python
import requests

# Login
response = requests.post('http://localhost:5000/api/auth/login', json={
    'identifier': 'dean',
    'password': 'dean123'
})
token = response.json()['access_token']

# Predict performance
headers = {'Authorization': f'Bearer {token}'}
response = requests.post(
    'http://localhost:5000/api/predictions/predict',
    json={'student_id': 'J21B05/001', 'model_type': 'ensemble'},
    headers=headers
)
print(response.json())
```

### Example 2: Get FEX Analytics

```python
response = requests.get(
    'http://localhost:5000/api/analytics/fex?drilldown=department',
    headers=headers
)
data = response.json()
print(f"Total FEX: {data['summary']['total_fex']}")
```

### Example 3: Scenario Analysis

```python
response = requests.post(
    'http://localhost:5000/api/predictions/scenario',
    json={
        'student_id': 'J21B05/001',
        'scenarios': [
            {
                'name': 'Improved Attendance',
                'attendance_rate': 90,
                'payment_completion_rate': 100
            }
        ]
    },
    headers=headers
)
```

---

## 🔧 Troubleshooting

### Common Issues

1. **"Model not trained" error**
   ```bash
   cd backend
   python train_models.py
   ```

2. **Database connection error**
   - Check MySQL is running
   - Verify credentials in `config.py`
   - Ensure database exists

3. **Port already in use**
   - Change port in `app.py` or `start_server.py`
   - Kill existing process: `netstat -ano | findstr :5000`

4. **Frontend not connecting to backend**
   - Check CORS settings in `app.py`
   - Verify backend is running on port 5000
   - Check API base URL in frontend

5. **Charts not rendering**
   - Check browser console for errors
   - Verify SciChart.js WASM files are accessible
   - System will fallback to Recharts automatically

### Logs

- **Backend logs**: Console output when running `python app.py`
- **ETL logs**: `backend/logs/etl_pipeline_*.log`
- **Frontend logs**: Browser console (F12)

---

## 📊 Model Performance Summary

| Model | Type | R² Score | RMSE | Use Case |
|-------|------|----------|------|----------|
| Random Forest | Regression | 0.9992 | 0.71 | General performance prediction |
| Gradient Boosting | Regression | 0.9995 | 0.59 | General performance prediction (best) |
| Neural Network | Regression | 0.9961 | 1.58 | Complex pattern recognition |
| Tuition-Attendance | Regression | -0.42 | 4.86 | Early intervention prediction |
| Enrollment Trend | Regression | - | - | Resource allocation |

**Note**: Negative R² scores indicate the model needs more training data or feature engineering.

---

## 🚀 Future Enhancements

- [ ] Real-time data streaming
- [ ] Advanced visualization dashboards
- [ ] Mobile app integration
- [ ] Automated report scheduling
- [ ] Email notifications for predictions
- [ ] Integration with student information systems
- [ ] Advanced ML models (XGBoost, LightGBM)
- [ ] Model versioning and A/B testing

---

## 📝 License

This project is developed for Uganda Christian University (UCU) as part of a final year project.

---

## 👥 Contributors

- NextGen Data Architects Team

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check logs for error messages
4. Contact the development team

---

**Last Updated**: November 2024
**Version**: 1.0.0
