-- UEMCRP Seed Data

-- Programs
INSERT INTO programs (name, degree, duration, department, seats) VALUES
('B.Tech Computer Science & Engineering', 'B.Tech', '4 years', 'CSE', 180),
('B.Tech Electronics & Communication', 'B.Tech', '4 years', 'ECE', 120),
('B.Tech Electrical Engineering', 'B.Tech', '4 years', 'EE', 60),
('B.Tech Mechanical Engineering', 'B.Tech', '4 years', 'ME', 60),
('B.Tech Civil Engineering', 'B.Tech', '4 years', 'CE', 60),
('B.Tech Information Technology', 'B.Tech', '4 years', 'IT', 60),
('M.Tech Computer Science & Engineering', 'M.Tech', '2 years', 'CSE', 30),
('M.Tech VLSI Design', 'M.Tech', '2 years', 'ECE', 18),
('M.Tech Power Systems', 'M.Tech', '2 years', 'EE', 18),
('MBA General Management', 'MBA', '2 years', 'MBA', 120),
('MCA', 'MCA', '3 years', 'MCA', 60),
('Ph.D Computer Science', 'Ph.D', '3-5 years', 'CSE', 10),
('Ph.D Electronics & Communication', 'Ph.D', '3-5 years', 'ECE', 8);

-- Notices
INSERT INTO notices (title, date, type, content) VALUES
('Fall 2026 Semester Registration Open', '2026-08-15', 'academic', 'Online registration for Fall 2026 semester is now open. Last date to register: September 10, 2026.'),
('Campus Placement Drive — TCS', '2026-09-05', 'placement', 'TCS will be conducting a campus placement drive for B.Tech CSE, IT, and ECE students. Eligibility: CGPA >= 6.0.'),
('Annual Tech Fest — Innovision 2026', '2026-09-20', 'event', 'Innovision 2026, the annual technical festival of UEM, will be held from September 20-22. Events include hackathon, robotics, paper presentation, and more.'),
('Mid-Semester Exam Schedule', '2026-09-10', 'academic', 'Mid-semester examinations will begin from October 1, 2026. Detailed schedule will be uploaded on the student portal.'),
('Guest Lecture on AI & Machine Learning', '2026-09-12', 'event', 'Department of CSE invites students to a guest lecture on "Recent Trends in AI & ML" by Dr. Rajesh Kumar, IIT Kharagpur.'),
('Scholarship Applications Open', '2026-08-20', 'academic', 'Merit-cum-means scholarship applications for 2026-27 are now open. Apply through the student portal before September 30.'),
('Independence Day Celebration', '2026-08-15', 'event', 'Flag hoisting ceremony at 9:00 AM in the main auditorium. All students and faculty are requested to attend.'),
('New Library Timings', '2026-08-10', 'academic', 'Library hours extended to 10 PM during examination period. Weekend hours: 8 AM - 6 PM.');

-- Events
INSERT INTO events (title, date, end_date, type, description) VALUES
('Innovision 2026 — Annual Tech Fest', '2026-09-20', '2026-09-22', 'tech-fest', 'Three-day annual technical festival with hackathons, robotics competitions, and cultural performances.'),
('Industry-Academia Conclave', '2026-10-05', NULL, 'conference', 'Annual conclave bringing together industry leaders and academicians to discuss future of engineering education.'),
('Campus Recruitment — Infosys', '2026-10-15', NULL, 'placement', 'Infosys recruitment drive for final year B.Tech students across all branches.'),
('Sports Week', '2026-11-01', '2026-11-07', 'cultural', 'Inter-department sports competition including cricket, football, basketball, badminton, and athletics.'),
('Technical Paper Presentation', '2026-09-21', NULL, 'tech-fest', 'Present your research papers on emerging technologies. Best paper awards worth ₹25,000.'),
('Hackathon 2026', '2026-09-20', NULL, 'tech-fest', '36-hour hackathon with ₹50,000 prize pool. Teams of 2-4 members. Theme: Smart Campus.'),
('Alumni Meet 2026', '2026-12-20', NULL, 'cultural', 'Annual alumni reunion. Connect with 10,000+ UEM alumni working across the globe.'),
('Farewell Party — Batch of 2026', '2027-05-10', NULL, 'cultural', 'Farewell celebration for graduating students. Cultural performances, awards, and memories.');

-- Faculty
INSERT INTO faculty (name, department, designation, qualification, experience) VALUES
('Dr. Amitava Ghosh', 'CSE', 'Professor & Head', 'Ph.D (IIT Kharagpur)', '22 years'),
('Dr. Suchismita Das', 'ECE', 'Professor', 'Ph.D (Jadavpur University)', '18 years'),
('Dr. Rana Majumder', 'EE', 'Professor & Head', 'Ph.D (NIT Durgapur)', '20 years'),
('Dr. Arup Kumar Mitra', 'ME', 'Professor', 'Ph.D (BESU Shibpur)', '19 years'),
('Dr. Priya Banerjee', 'MBA', 'Professor & Head', 'Ph.D (IIM Calcutta)', '15 years'),
('Dr. Sankar Nath Das', 'CSE', 'Associate Professor', 'Ph.D (NIT Rourkela)', '12 years'),
('Prof. (Dr.) Rajib Bandopadhyay', 'CE', 'Professor & Head', 'Ph.D (JU)', '25 years'),
('Dr. Dipanwita Das', 'CSE', 'Assistant Professor', 'Ph.D (IIEST Shibpur)', '8 years'),
('Dr. Subrata Dasgupta', 'CSE', 'Associate Professor', 'Ph.D (IIT Delhi)', '14 years'),
('Dr. Arpita Ghosh', 'ECE', 'Assistant Professor', 'Ph.D (NIT Silchar)', '6 years'),
('Prof. Manas Kumar Sanyal', 'EE', 'Professor', 'Ph.D (IIT Kharagpur)', '23 years'),
('Dr. Anindya Bose', 'ME', 'Associate Professor', 'Ph.D (IIT ISM Dhanbad)', '11 years');

-- Placements
INSERT INTO placements (year, total_students, placed, rate, highest_package, average_package) VALUES
(2025, 480, 456, 95, '42 LPA', '6.5 LPA');

INSERT INTO top_recruiters (placement_id, name, offers) VALUES
(1, 'TCS', 120),
(1, 'Infosys', 85),
(1, 'Wipro', 65),
(1, 'Cognizant', 55),
(1, 'Accenture', 40),
(1, 'IBM', 30),
(1, 'Capgemini', 25),
(1, 'HCL', 20),
(1, 'Tech Mahindra', 18),
(1, 'L&T Infotech', 15),
(1, 'Mindtree', 12),
(1, 'Amazon', 5);

-- Academic Calendar
INSERT INTO academic_calendar (event, date, end_date, type) VALUES
('Fall 2026 Semester Begins', '2026-08-01', NULL, 'semester'),
('Last Date for Semester Registration', '2026-09-10', NULL, 'deadline'),
('Mid-Semester Examinations Begin', '2026-10-01', NULL, 'exam'),
('Mid-Semester Exams End', '2026-10-10', NULL, 'exam'),
('Puja Break', '2026-10-15', '2026-10-25', 'holiday'),
('End-Semester Examinations Begin', '2026-11-20', NULL, 'exam'),
('End-Semester Exams End', '2026-12-10', NULL, 'exam'),
('Winter Break', '2026-12-15', '2027-01-05', 'holiday'),
('Spring 2027 Semester Begins', '2027-01-10', NULL, 'semester'),
('Republic Day Holiday', '2027-01-26', NULL, 'holiday'),
('Annual Day Celebration', '2027-02-15', NULL, 'event'),
('Placement Season Begins', '2027-03-01', NULL, 'placement'),
('Semester Ends', '2027-05-15', NULL, 'semester'),
('Summer Vacations Begin', '2027-05-16', '2027-07-15', 'holiday'),
('Independence Day Holiday', '2026-08-15', NULL, 'holiday'),
('Teachers Day Celebration', '2026-09-05', NULL, 'event'),
('Gandhi Jayanti Holiday', '2026-10-02', NULL, 'holiday');

-- Research
INSERT INTO research (title, pi, department, funding, amount, status, year) VALUES
('Deep Learning for Medical Image Analysis', 'Dr. Amitava Ghosh', 'CSE', 'DST SERB', '₹25 Lakhs', 'Ongoing', 2024),
('Smart Grid Energy Management Systems', 'Dr. Rana Majumder', 'EE', 'AICTE', '₹18 Lakhs', 'Ongoing', 2025),
('IoT-Based Water Quality Monitoring', 'Dr. Suchismita Das', 'ECE', 'DST', '₹12 Lakhs', 'Completed', 2023),
('Sustainable Construction Materials', 'Prof. (Dr.) Rajib Bandopadhyay', 'CE', 'UGC', '₹15 Lakhs', 'Ongoing', 2024),
('AI-Driven Supply Chain Optimization', 'Dr. Priya Banerjee', 'MBA', 'AICTE', '₹8 Lakhs', 'Completed', 2023),
('Renewable Energy Integration in Microgrids', 'Dr. Rana Majumder', 'EE', 'MNRE', '₹30 Lakhs', 'Ongoing', 2025),
('Natural Language Processing for Bengali', 'Dr. Subrata Dasgupta', 'CSE', 'DST SERB', '₹20 Lakhs', 'Ongoing', 2025),
('Autonomous Vehicle Navigation Systems', 'Dr. Arup Kumar Mitra', 'ME', 'AICTE', '₹22 Lakhs', 'Ongoing', 2024);

-- Campus
INSERT INTO campus (name, address, established, area) VALUES
('UEM Kolkata — Action Area III Campus', 'Action Area III, New Town, Kolkata, West Bengal 700156, India', 2001, '50 acres');

INSERT INTO campus_facilities (campus_id, name, description, icon) VALUES
(1, 'Central Library', 'Over 80,000 volumes, digital access to IEEE, Springer, and Elsevier journals', 'fa-book'),
(1, 'Computer Labs', '12 state-of-the-art labs with 800+ workstations and high-speed internet', 'fa-desktop'),
(1, 'Auditorium', '500-seat auditorium with modern audio-visual equipment', 'fa-theater-masks'),
(1, 'Sports Complex', 'Indoor and outdoor facilities for cricket, football, basketball, badminton, and gym', 'fa-running'),
(1, 'Hostels', 'Separate hostels for boys and girls with Wi-Fi, mess, and 24/7 security', 'fa-home'),
(1, 'Cafeteria', 'Multi-cuisine cafeteria and juice bar serving 2000+ students daily', 'fa-utensils'),
(1, 'Medical Center', 'On-campus medical center with ambulance facility and tie-up with nearest hospital', 'fa-medkit'),
(1, 'Innovation Lab', 'Dedicated space for robotics, 3D printing, and IoT prototyping', 'fa-flask'),
(1, 'Seminar Hall', '200-capacity hall for workshops, guest lectures, and faculty meetings', 'fa-chalkboard-teacher'),
(1, 'Open Air Theatre', 'Amphitheatre for cultural events, performances, and student gatherings', 'fa-music');

-- Privacy Policy
INSERT INTO privacy_policy (last_updated) VALUES ('2026-08-01');

INSERT INTO privacy_policy_sections (policy_id, title, content) VALUES
(1, 'Information We Collect', 'We collect personal information such as name, email address, phone number, and academic records when you apply for admission or register for programs. We also collect usage data including IP address, browser type, and pages visited to improve our services.'),
(1, 'How We Use Your Information', 'Your information is used to process admissions, communicate about academic matters, send university notifications, improve our website and services, and comply with legal obligations.'),
(1, 'Data Sharing', 'We do not sell or rent personal information to third parties. Data may be shared with government bodies for regulatory compliance, accredited agencies for quality assurance, and technology service providers who assist in operating our systems under strict confidentiality agreements.'),
(1, 'Data Security', 'We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal information from unauthorized access, disclosure, or misuse.'),
(1, 'Cookies', 'Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.'),
(1, 'Your Rights', 'You have the right to access, correct, or delete your personal data. To exercise these rights, please contact the university data protection officer at privacy@uem.edu.in.'),
(1, 'Contact', 'For questions about this privacy policy, contact: Data Protection Officer, UEM Kolkata, Action Area III, New Town, Kolkata 700156. Email: privacy@uem.edu.in');

-- Demo Student (password: uem123)
INSERT INTO users (id, name, email, phone, password, department, semester, program, admission_year, dob, gender, blood_group, address, cgpa, backlogs) VALUES
('UEM/2023/CSE/401', 'Amit Sharma', 'amit.shashorst@uem.edu.in', '9876543210', '2c9c991823e7c9f98ba732b2fa05a0f532b8fa023fbc9cc54c6b29fd9acd9c07', 'CSE', 5, 'B.Tech Computer Science & Engineering', 2023, '2004-05-12', 'Male', 'B+', 'Salt Lake, Kolkata', 8.2, 0);

-- Demo Student Grades
INSERT INTO grades (user_id, semester, subject_code, subject_name, credits, grade) VALUES
('UEM/2023/CSE/401', 3, 'CS301', 'Data Structures', 4, 'A'),
('UEM/2023/CSE/401', 3, 'CS302', 'OOP with Java', 3, 'A+'),
('UEM/2023/CSE/401', 3, 'CS303', 'Digital Electronics', 3, 'B+'),
('UEM/2023/CSE/401', 3, 'MA301', 'Linear Algebra', 3, 'A'),
('UEM/2023/CSE/401', 3, 'CS304', 'DBMS Lab', 2, 'A+'),
('UEM/2023/CSE/401', 4, 'CS401', 'Algorithms', 4, 'A+'),
('UEM/2023/CSE/401', 4, 'CS402', 'Operating Systems', 3, 'A'),
('UEM/2023/CSE/401', 4, 'CS403', 'Computer Networks', 3, 'B+'),
('UEM/2023/CSE/401', 4, 'MA401', 'Probability & Statistics', 3, 'A'),
('UEM/2023/CSE/401', 4, 'CS404', 'OS Lab', 2, 'A'),
('UEM/2023/CSE/401', 5, 'CS501', 'Compiler Design', 3, 'A'),
('UEM/2023/CSE/401', 5, 'CS502', 'Software Engineering', 3, 'B+'),
('UEM/2023/CSE/401', 5, 'CS503', 'Web Technologies', 3, 'A+'),
('UEM/2023/CSE/401', 5, 'CS504', 'AI & ML Fundamentals', 3, 'A'),
('UEM/2023/CSE/401', 5, 'CS505', 'Mini Project', 2, 'A+');

-- Demo Student Attendance
INSERT INTO attendance (user_id, subject_code, subject_name, total, attended) VALUES
('UEM/2023/CSE/401', 'CS501', 'Compiler Design', 40, 35),
('UEM/2023/CSE/401', 'CS502', 'Software Engineering', 40, 33),
('UEM/2023/CSE/401', 'CS503', 'Web Technologies', 40, 38),
('UEM/2023/CSE/401', 'CS504', 'AI & ML Fundamentals', 40, 34),
('UEM/2023/CSE/401', 'CS505', 'Mini Project', 20, 19);

-- Demo Student Fees
INSERT INTO fees (user_id, semester, amount, paid, status, date, due_date, receipt_no) VALUES
('UEM/2023/CSE/401', 5, 125000, 125000, 'paid', '2026-08-15', NULL, 'UEM/RCPT/2026/0847'),
('UEM/2023/CSE/401', 6, 125000, 0, 'pending', NULL, '2027-01-15', NULL);

-- Demo Student Timetable
INSERT INTO timetable (user_id, time_slot, day, subject, room, type) VALUES
('UEM/2023/CSE/401', '09:00 - 09:50', 'mon', 'Compiler Design', 'A-301', 'Lecture'),
('UEM/2023/CSE/401', '09:00 - 09:50', 'tue', 'Software Engineering', 'A-301', 'Lecture'),
('UEM/2023/CSE/401', '09:00 - 09:50', 'wed', 'AI & ML Fundamentals', 'B-201', 'Lecture'),
('UEM/2023/CSE/401', '09:00 - 09:50', 'thu', 'Compiler Design', 'A-301', 'Tutorial'),
('UEM/2023/CSE/401', '09:00 - 09:50', 'fri', 'Web Technologies', 'C-105', 'Lab'),
('UEM/2023/CSE/401', '10:00 - 10:50', 'mon', 'Software Engineering', 'A-301', 'Lecture'),
('UEM/2023/CSE/401', '10:00 - 10:50', 'tue', 'AI & ML Fundamentals', 'B-201', 'Lecture'),
('UEM/2023/CSE/401', '10:00 - 10:50', 'wed', 'Web Technologies', 'C-105', 'Lecture'),
('UEM/2023/CSE/401', '10:00 - 10:50', 'thu', 'Software Engineering', 'A-301', 'Lab'),
('UEM/2023/CSE/401', '10:00 - 10:50', 'fri', 'Mini Project', 'D-102', 'Project'),
('UEM/2023/CSE/401', '11:00 - 11:50', 'mon', 'AI & ML Fundamentals', 'B-201', 'Lecture'),
('UEM/2023/CSE/401', '11:00 - 11:50', 'tue', 'Web Technologies', 'C-105', 'Lecture'),
('UEM/2023/CSE/401', '11:00 - 11:50', 'wed', 'Mini Project', 'D-102', 'Project'),
('UEM/2023/CSE/401', '11:00 - 11:50', 'thu', 'AI & ML Fundamentals', 'B-201', 'Lab'),
('UEM/2023/CSE/401', '11:00 - 11:50', 'fri', 'Compiler Design', 'A-301', 'Lecture'),
('UEM/2023/CSE/401', '14:00 - 14:50', 'mon', 'Mini Project', 'D-102', 'Project'),
('UEM/2023/CSE/401', '14:00 - 14:50', 'tue', 'Mini Project', 'D-102', 'Project');

-- Demo Student Library
INSERT INTO library_books (user_id, title, author, issued, due, status) VALUES
('UEM/2023/CSE/401', 'Introduction to Algorithms (CLRS)', 'Cormen et al.', '2026-08-01', '2026-08-30', 'returned'),
('UEM/2023/CSE/401', 'Database System Concepts', 'Silberschatz', '2026-08-15', '2026-09-15', 'issued'),
('UEM/2023/CSE/401', 'Computer Networks (Tanenbaum)', 'Tanenbaum', '2026-08-20', '2026-09-20', 'issued');
