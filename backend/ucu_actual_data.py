"""
UCU Actual Data from Fees Structure 2025 PDF
Extracted from official UCU documents
"""

# UCU 12 Faculties/Schools (Actual from website and PDF)
UCU_FACULTIES = [
    {'id': 1, 'name': 'Bishop Tucker School of Divinity and Theology', 'dean': 'Rev. Dr. Samuel Kizito'},
    {'id': 2, 'name': 'School of Education', 'dean': 'Dr. Rebecca Nakato'},
    {'id': 3, 'name': 'School of Business', 'dean': 'Dr. Sarah Kakuru'},
    {'id': 4, 'name': 'School of Law', 'dean': 'Prof. John Mutyaba'},
    {'id': 5, 'name': 'School of Medicine', 'dean': 'Dr. Peter Mukasa'},
    {'id': 6, 'name': 'School of Dentistry', 'dean': 'Dr. Yohana Eyob'},
    {'id': 7, 'name': 'Faculty of Public Health, Nursing and Midwifery', 'dean': 'Dr. Esther Komugisha'},
    {'id': 8, 'name': 'School of Journalism, Media and Communication', 'dean': 'Dr. Grace Nalubega'},
    {'id': 9, 'name': 'Faculty of Agricultural Sciences', 'dean': 'Prof. James Kato'},
    {'id': 10, 'name': 'Faculty of Engineering Design and Technology', 'dean': 'Dr. Allan Mugisha'},
    {'id': 11, 'name': 'School of Social Sciences', 'dean': 'Prof. Mawejje Johnpaul'},
    {'id': 12, 'name': 'Faculty of Science', 'dean': 'Prof. David Ssemwogerere'},
]

# UCU Programs from Fees Structure 2025 PDF
# Format: (program_name, faculty_id, duration_years, tuition_nationals, tuition_non_nationals, degree_level)
UCU_PROGRAMS = [
    # Bishop Tucker School of Divinity and Theology
    ('Master of Theological Studies', 1, 2, 2545000, 3817500, 'Master'),
    ('Master of Arts in Theology', 1, 2, 2545000, 3817500, 'Master'),
    ('Master of Divinity', 1, 3, 1904000, 2856000, 'Master'),
    ('PhD in Theology', 1, 3, 5696000, 8544000, 'PhD'),
    ('Doctor of Ministry', 1, 3, 3844500, 5766750, 'Doctorate'),
    ('Bachelor of Divinity', 1, 3, 1818000, 2727000, 'Bachelor'),
    
    # School of Education
    ('PGD Education', 2, 1, 2546500, 3819750, 'Postgraduate Diploma'),
    ('PGD Higher Education', 2, 1, 2546500, 3819750, 'Postgraduate Diploma'),
    ('PGD Internationalisation of Education', 2, 1, 2546500, 3819750, 'Postgraduate Diploma'),
    ('Master of Education Administration and Management', 2, 2, 2546500, 3819750, 'Master'),
    ('MA Literature', 2, 2, 2546500, 3819750, 'Master'),
    ('Master of Library and Information Science', 2, 2, 2546500, 3819750, 'Master'),
    ('Master of Education in Curriculum Studies', 2, 2, 2546500, 3819750, 'Master'),
    ('Master of Educational Psychology', 2, 2, 2546500, 3819750, 'Master'),
    ('Master of Higher Education Pedagogy and Leadership', 2, 2, 2546500, 3819750, 'Master'),
    ('PhD in Literature', 2, 3, 5696000, 8544000, 'PhD'),
    ('PhD in Education (Administration and Management)', 2, 3, 5696000, 8544000, 'PhD'),
    ('Higher Education Certificate (Arts)', 2, 1, 1050000, 1575000, 'Certificate'),
    ('Higher Education Certificate (Sciences)', 2, 1, 1270000, 1905000, 'Certificate'),
    ('Higher Education Certificate (Blended)', 2, 1, 1000000, 0, 'Certificate'),
    ('Bachelor of Science in Education', 2, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Education (Recess) (Upgrading teachers)', 2, 2, 1000000, 0, 'Bachelor'),
    ('BA Education', 2, 3, 1818000, 2727000, 'Bachelor'),
    
    # School of Business
    ('PGD Human Resource Management', 3, 1, 2584000, 3876000, 'Postgraduate Diploma'),
    ('PGD Sustainable Business and Renewable Energy', 3, 1, 2584000, 3876000, 'Postgraduate Diploma'),
    ('Master of Human Resource Management', 3, 2, 2584000, 3876000, 'Master'),
    ('Master of Business Administration', 3, 2, 2584000, 3876000, 'Master'),
    ('Master of Arts in Organizational Leadership and Management', 3, 3, 1764000, 2646000, 'Master'),
    ('Master of Science in Procurement and Supply Chain Management', 3, 2, 2584000, 3876000, 'Master'),
    ('PhD in Business Administration', 3, 3, 5696000, 8544000, 'PhD'),
    ('Diploma in Business Administration', 3, 2, 700000, 1050000, 'Diploma'),
    ('Bachelor of Business Administration', 3, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Procurement and Logistics Management', 3, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Human Resource Management', 3, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Science in Accounting and Finance', 3, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Science in Economics and Statistics', 3, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Tourism & Hospitality Management', 3, 3, 1818000, 2727000, 'Bachelor'),
    
    # School of Law
    ('Master of Laws in International Business Law', 4, 2, 4623000, 6934500, 'Master'),
    ('Master of Laws in International Energy Law and Policy', 4, 2, 5100000, 7650000, 'Master'),
    ('Master of Laws Oil & Gas', 4, 2, 5100000, 7650000, 'Master'),
    ('Diploma in Law', 4, 2, 600000, 900000, 'Diploma'),
    ('Bachelor of Laws', 4, 4, 2325000, 3487500, 'Bachelor'),
    
    # School of Medicine
    ('Bachelor of Medicine and Bachelor of Surgery', 5, 5, 5000000, 7500000, 'Bachelor'),
    
    # School of Dentistry
    ('Bachelor of Dental Surgery', 6, 5, 5000000, 7500000, 'Bachelor'),
    
    # Faculty of Public Health, Nursing and Midwifery
    ('Master of Public Health Leadership', 7, 2, 2586500, 3879750, 'Master'),
    ('Master of Nursing Science', 7, 2, 2586500, 3879750, 'Master'),
    ('Master of Public Health', 7, 2, 2586500, 3879750, 'Master'),
    ('Bachelor of Public Health', 7, 3, 2304000, 3456000, 'Bachelor'),
    ('Bachelor of Nursing Science (For A\' level Applicants)', 7, 4, 2304000, 3456000, 'Bachelor'),
    ('Bachelor of Nursing Science (Diploma entry)', 7, 3, 2304000, 3456000, 'Bachelor'),
    
    # School of Journalism, Media and Communication
    ('MA Journalism and Strategic Communication', 8, 2, 2545000, 3817500, 'Master'),
    ('Master of Arts in Strategic Communication', 8, 2, 2545000, 3817500, 'Master'),
    ('PhD in Journalism, Media and Communication', 8, 3, 5696000, 8544000, 'PhD'),
    ('BA Journalism and Communication', 8, 3, 2304000, 3456000, 'Bachelor'),
    
    # Faculty of Agricultural Sciences
    ('Master of Science in Agriculture (Rural Dev\'t| Crop Sc. | Soil Sc.)', 9, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Agricultural Economics', 9, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Agribusiness Management and Entrepreneurship', 9, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Human Nutrition', 9, 2, 2545000, 3817500, 'Master'),
    ('PhD in Agricultural Systems and Value Chain Mgt', 9, 3, 5696000, 8544000, 'PhD'),
    ('Bachelor of Science in Agricultural Science and Entrepreneurship', 9, 4, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Science in Human Nutrition and Clinical Dietetics', 9, 4, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Science in Food Science and Technology', 9, 4, 2425000, 3637500, 'Bachelor'),
    
    # Faculty of Engineering Design and Technology
    ('PGD Water and Sanitation', 10, 1, 2545000, 3817500, 'Postgraduate Diploma'),
    ('Master of Science in Water and Sanitation', 10, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Computer Science', 10, 2, 2545000, 3817500, 'Master'),
    ('Master of Information Technology', 10, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Data Science and Analytics', 10, 2, 2545000, 3817500, 'Master'),
    ('Master of Science in Environmental Science & Mgt', 10, 2, 2545000, 3817500, 'Master'),
    ('Diploma in Information Technology', 10, 2, 700000, 1050000, 'Diploma'),
    ('Diploma in Visual Art and Design', 10, 2, 700000, 1050000, 'Diploma'),
    ('Bachelor of Visual Art and Design', 10, 3, 1941000, 2911500, 'Bachelor'),
    ('Bachelor of Science in Data Science and Analytics', 10, 3, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Science in Computer Science', 10, 3, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Art in Graphic Design and Animation', 10, 3, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Science in Information Technology', 10, 3, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Science in Civil and Environmental Engineering', 10, 4, 2425000, 3637500, 'Bachelor'),
    ('Bachelor of Electronics and Communication Science', 10, 3, 2425000, 3637500, 'Bachelor'),
    
    # School of Social Sciences
    ('PGD Public Administration', 11, 1, 2546000, 3819000, 'Postgraduate Diploma'),
    ('PGD Development Monitoring and Evaluation', 11, 1, 2546000, 3819000, 'Postgraduate Diploma'),
    ('Master of Social Work', 11, 2, 2545000, 3817500, 'Master'),
    ('Master of Counseling Psychology', 11, 2, 2209000, 3313500, 'Master'),
    ('Master of Governance and International Relations', 11, 2, 2546000, 3819000, 'Master'),
    ('Master of Public Administration and Management', 11, 2, 2546000, 3819000, 'Master'),
    ('Master of Research and Public Policy', 11, 2, 2545000, 3817500, 'Master'),
    ('Master of Development Monitoring and Evaluation', 11, 2, 2546000, 3819000, 'Master'),
    ('Master of Arts in African Studies', 11, 2, 2545000, 3817500, 'Master'),
    ('PhD in Development Studies', 11, 3, 5696000, 8544000, 'PhD'),
    ('Diploma in Social Work and Social Administration', 11, 2, 700000, 1050000, 'Diploma'),
    ('Bachelor of Public Administration and Management', 11, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Governance and International Relations', 11, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Human Rights, Peace and Humanitarian Interventions', 11, 3, 1818000, 2727000, 'Bachelor'),
    ('Bachelor of Social Work and Social Administration', 11, 3, 1818000, 2727000, 'Bachelor'),
]

# Functional Fees (Per Semester) from PDF
FUNCTIONAL_FEES = {
    'undergraduate': {
        'registration_fee': 53000,
        'development_fee': 500000,
        'medical_fee': 70000,
        'student_activity_fee': 90000,
        'computer_fee': 100000,
        'examination_fee': 80000,
        'book_fee_imat': 90000,
        'total': 983000
    },
    'postgraduate': {
        'registration_fee': 35000,
        'development_fee': 333000,
        'medical_fee': 0,  # Not specified for postgrad
        'student_activity_fee': 66000,
        'computer_fee': 67000,
        'examination_fee': 53000,
        'book_fee_imat': 64000,
        'total': 618000
    }
}

# Recess Term Fees (MBChB & BDS Students)
RECESS_TERM_FEES = {
    'development_fee': 210000,
    'medical_fee': 70000,
    'imat_fee': 100000,
    'computer_fee': 90000,
    'examination_fee': 80000,
    'total': 550000
}

# Halls of Residence Fees (Per Semester)
HALLS_OF_RESIDENCE = {
    'mukono': {
        'executive_room': 1500000,
        'double_room_large': None,  # Not specified
        'double_room_normal': 850000,
        'ordinary': 650000
    },
    'kampala': {
        'executive_room': 1800000,
        'double_room_large': 1700000,
        'double_room_normal': 1000000,
        'ordinary': 850000
    }
}

# Application Fees
APPLICATION_FEES = {
    'with_pre_entry_exam': 150000,  # LLB, MBChB, BDS, MBA, MDIV
    'other_courses': 100000
}

# Annual Fees
ANNUAL_FEES = {
    'national_council_higher_education': 20000,
    'church_fee': 5000
}
