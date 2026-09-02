-- Colleges
INSERT INTO colleges (id, name, code, address, phone, email) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Institute of Engineering & Management, Kolkata', 'IEM-KOL', 'Plot K2, Sector V, Kolkata 700091', '+91-33-23570001', 'admin@iemkolkata.edu.in'),
    ('a2222222-2222-2222-2222-222222222222', 'Institute of Engineering & Management, Delhi', 'IEM-DEL', 'Sector 25, Dwarka, New Delhi 110075', '+91-11-28080900', 'admin@iemdelhi.edu.in'),
    ('a3333333-3333-3333-3333-333333333333', 'Institute of Engineering & Management, Mumbai', 'IEM-MUM', 'Andheri East, Mumbai 400069', '+91-22-28320001', 'admin@iemmumbai.edu.in'),
    ('a4444444-4444-4444-4444-444444444444', 'Institute of Engineering & Management, Bangalore', 'IEM-BLR', 'Electronics City, Bangalore 560100', '+91-80-28520001', 'admin@iembangalore.edu.in');

-- Password: password123 (bcrypt $2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi)
INSERT INTO users (id, college_id, username, email, password_hash, role, first_name, last_name) VALUES
    -- Admin
    ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'admin', 'admin@iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'ADMIN', 'System', 'Admin'),
    -- Staff
    ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'staff1', 'raj.mukherjee@iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STAFF', 'Raj', 'Mukherjee'),
    ('b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'staff2', 'priya.das@iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STAFF', 'Priya', 'Das'),
    -- Students
    ('b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'student1', 'aman.gupta@student.iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STUDENT', 'Aman', 'Gupta'),
    ('b5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'student2', 'neha.sharma@student.iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STUDENT', 'Neha', 'Sharma'),
    ('b6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', 'student3', 'riya.sen@student.iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STUDENT', 'Riya', 'Sen'),
    ('b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'student4', 'souvik.biswas@student.iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STUDENT', 'Souvik', 'Biswas'),
    ('b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'student5', 'tanya.roy@student.iemkolkata.edu.in', '$2b$10$Lb6sAM2jOIeyaDo8oONXluJMjh9XXFxQgp4nNxa/Pe7AvLdPstfhi', 'STUDENT', 'Tanya', 'Roy');

-- Student profiles
INSERT INTO students (id, user_id, roll_number, college_id, department, semester, admission_year) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', 'IEM-CS-2022-001', 'a1111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 5, 2022),
    ('c2222222-2222-2222-2222-222222222222', 'b5555555-5555-5555-5555-555555555555', 'IEM-CS-2022-002', 'a1111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 5, 2022),
    ('c3333333-3333-3333-3333-333333333333', 'b6666666-6666-6666-6666-666666666666', 'IEM-IT-2023-001', 'a1111111-1111-1111-1111-111111111111', 'Information Technology', 4, 2023),
    ('c4444444-4444-4444-4444-444444444444', 'b7777777-7777-7777-7777-777777777777', 'IEM-CS-2023-003', 'a1111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 4, 2023),
    ('c5555555-5555-5555-5555-555555555555', 'b8888888-8888-8888-8888-888888888888', 'IEM-ECE-2023-001', 'a1111111-1111-1111-1111-111111111111', 'Electronics & Communication Engineering', 4, 2023);

-- Exams
INSERT INTO exams (id, college_id, name, exam_type, semester, academic_year) VALUES
    ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Mid Semester Exam - Sem 5', 'MIDTERM', 5, '2025-2026'),
    ('d2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Final Semester Exam - Sem 5', 'FINAL', 5, '2025-2026'),
    ('d3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Internal Assessment - Sem 4', 'INTERNAL', 4, '2025-2026');

-- Results
INSERT INTO results (id, student_id, exam_id, subject_code, subject_name, marks_obtained, max_marks, grade) VALUES
    -- Aman Gupta (Sem 5 Midterm)
    ('e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS501', 'Algorithm Design & Analysis', 82, 100, 'A'),
    ('e2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'CS502', 'Computer Networks', 74, 100, 'A'),
    ('e3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'CS501', 'Algorithm Design & Analysis', 88, 100, 'A'),
    -- Neha Sharma (Sem 5 Midterm)
    ('e4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'CS501', 'Algorithm Design & Analysis', 94, 100, 'A+'),
    ('e5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'CS502', 'Computer Networks', 87, 100, 'A'),
    -- Riya Sen (Sem 4 Internal)
    ('e6666666-6666-6666-6666-666666666666', 'c3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'IT401', 'Database Management Systems', 76, 100, 'A'),
    ('e7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'IT402', 'Web Technologies', 68, 100, 'B+'),
    -- Souvik Biswas (Sem 4 Internal)
    ('e8888888-8888-8888-8888-888888888888', 'c4444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', 'CS401', 'Object Oriented Programming', 91, 100, 'A+'),
    ('e9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', 'CS402', 'Data Communication', 79, 100, 'A'),
    -- Tanya Roy (Sem 4 Internal)
    ('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c5555555-5555-5555-5555-555555555555', 'd3333333-3333-3333-3333-333333333333', 'ECE401', 'Signals & Systems', 72, 100, 'B+'),
    ('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c5555555-5555-5555-5555-555555555555', 'd3333333-3333-3333-3333-333333333333', 'ECE402', 'Analog Electronics', 63, 100, 'B');

-- Attendance (5 days of records)
INSERT INTO attendance (student_id, college_id, date, status, created_by) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, 'PRESENT', 'b2222222-2222-2222-2222-222222222222'),
    ('c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, 'ABSENT', 'b2222222-2222-2222-2222-222222222222'),
    ('c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, 'LATE', 'b3333333-3333-3333-3333-333333333333'),
    ('c4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, 'PRESENT', 'b2222222-2222-2222-2222-222222222222'),
    ('c5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, 'PRESENT', 'b3333333-3333-3333-3333-333333333333'),
    ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 'PRESENT', 'b2222222-2222-2222-2222-222222222222'),
    ('c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 'PRESENT', 'b2222222-2222-2222-2222-222222222222'),
    ('c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 'ABSENT', 'b3333333-3333-3333-3333-333333333333');

-- Notices
INSERT INTO notices (college_id, title, content, published_by) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Mid-Semester Exam Schedule Released', 'The mid-semester examination schedule for all departments has been published. Students are advised to check the notice board for detailed timetables and room assignments.', 'b1111111-1111-1111-1111-111111111111'),
    ('a1111111-1111-1111-1111-111111111111', 'Holiday Notice - Republic Day', 'The college will remain closed on 26th January on account of Republic Day. Regular classes will resume on 27th January.', 'b1111111-1111-1111-1111-111111111111'),
    ('a1111111-1111-1111-1111-111111111111', 'Campus Recruitment Drive', 'A campus recruitment drive will be conducted on 15th February. Eligible students from CSE, IT, and ECE departments should register through the placement cell.', 'b1111111-1111-1111-1111-111111111111'),
    ('a1111111-1111-1111-1111-111111111111', 'Library Hours Extended', 'The central library will remain open until 10 PM during the examination period starting from 10th February.', 'b1111111-1111-1111-1111-111111111111');

-- Audit log entries
INSERT INTO audit_log (user_id, action, entity_type, entity_id, ip_address) VALUES
    ('b1111111-1111-1111-1111-111111111111', 'LOGIN', 'USER', 'b1111111-1111-1111-1111-111111111111', '192.168.1.100'),
    ('b2222222-2222-2222-2222-222222222222', 'LOGIN', 'USER', 'b2222222-2222-2222-2222-222222222222', '192.168.1.101'),
    ('b2222222-2222-2222-2222-222222222222', 'CREATE', 'RESULT', 'e1111111-1111-1111-1111-111111111111', '192.168.1.101'),
    ('b2222222-2222-2222-2222-222222222222', 'CREATE', 'RESULT', 'e2222222-2222-2222-2222-222222222222', '192.168.1.101'),
    ('b3333333-3333-3333-3333-333333333333', 'LOGIN', 'USER', 'b3333333-3333-3333-3333-333333333333', '192.168.1.102'),
    ('b3333333-3333-3333-3333-333333333333', 'UPDATE', 'ATTENDANCE', NULL, '192.168.1.102'),
    ('b1111111-1111-1111-1111-111111111111', 'CREATE', 'NOTICE', NULL, '192.168.1.100'),
    ('b4444444-4444-4444-4444-444444444444', 'LOGIN', 'USER', 'b4444444-4444-4444-4444-444444444444', '10.0.0.50'),
    ('b4444444-4444-4444-4444-444444444444', 'READ', 'RESULT', 'e1111111-1111-1111-1111-111111111111', '10.0.0.50'),
    ('b5555555-5555-5555-5555-555555555555', 'LOGIN', 'USER', 'b5555555-5555-5555-5555-555555555555', '10.0.0.51'),
    ('b5555555-5555-5555-5555-555555555555', 'READ', 'RESULT', 'e4444444-4444-4444-4444-444444444444', '10.0.0.51'),
    ('b1111111-1111-1111-1111-111111111111', 'UPDATE', 'USER', 'b2222222-2222-2222-2222-222222222222', '192.168.1.100'),
    ('b2222222-2222-2222-2222-222222222222', 'CREATE', 'EXAM', 'd1111111-1111-1111-1111-111111111111', '192.168.1.101');
