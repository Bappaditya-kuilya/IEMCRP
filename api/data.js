export const programs = [
  { id: 1, name: 'B.Tech Computer Science & Engineering', degree: 'B.Tech', duration: '4 years', department: 'CSE', seats: 180 },
  { id: 2, name: 'B.Tech Electronics & Communication', degree: 'B.Tech', duration: '4 years', department: 'ECE', seats: 120 },
  { id: 3, name: 'B.Tech Electrical Engineering', degree: 'B.Tech', duration: '4 years', department: 'EE', seats: 60 },
  { id: 4, name: 'B.Tech Mechanical Engineering', degree: 'B.Tech', duration: '4 years', department: 'ME', seats: 60 },
  { id: 5, name: 'B.Tech Civil Engineering', degree: 'B.Tech', duration: '4 years', department: 'CE', seats: 60 },
  { id: 6, name: 'B.Tech Information Technology', degree: 'B.Tech', duration: '4 years', department: 'IT', seats: 60 },
  { id: 7, name: 'M.Tech Computer Science & Engineering', degree: 'M.Tech', duration: '2 years', department: 'CSE', seats: 30 },
  { id: 8, name: 'M.Tech VLSI Design', degree: 'M.Tech', duration: '2 years', department: 'ECE', seats: 18 },
  { id: 9, name: 'M.Tech Power Systems', degree: 'M.Tech', duration: '2 years', department: 'EE', seats: 18 },
  { id: 10, name: 'MBA General Management', degree: 'MBA', duration: '2 years', department: 'MBA', seats: 120 },
  { id: 11, name: 'MCA', degree: 'MCA', duration: '3 years', department: 'MCA', seats: 60 },
  { id: 12, name: 'Ph.D Computer Science', degree: 'Ph.D', duration: '3-5 years', department: 'CSE', seats: 10 },
  { id: 13, name: 'Ph.D Electronics & Communication', degree: 'Ph.D', duration: '3-5 years', department: 'ECE', seats: 8 },
];

export const stats = {
  established: 2001, departments: 12, students: 5500, faculty: 350, placementRate: 95,
  recruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Capgemini', 'HCL', 'Tech Mahindra', 'L&T Infotech'],
  ranking: { nirf: 152, outlook: 45, indiaToday: 38 },
  campus: { area: '50 acres', buildings: 8, labs: 12, libraries: 1 },
};

export const notices = [
  { id: 1, title: 'Fall 2026 Semester Registration Open', date: '2026-08-15', type: 'academic', content: 'Online registration for Fall 2026 semester is now open. Last date to register: September 10, 2026.' },
  { id: 2, title: 'Campus Placement Drive — TCS', date: '2026-09-05', type: 'placement', content: 'TCS will be conducting a campus placement drive for B.Tech CSE, IT, and ECE students. Eligibility: CGPA >= 6.0.' },
  { id: 3, title: 'Annual Tech Fest — Innovision 2026', date: '2026-09-20', type: 'event', content: 'Innovision 2026, the annual technical festival of UEM, will be held from September 20-22. Events include hackathon, robotics, paper presentation, and more.' },
  { id: 4, title: 'Mid-Semester Exam Schedule', date: '2026-09-10', type: 'academic', content: 'Mid-semester examinations will begin from October 1, 2026. Detailed schedule will be uploaded on the student portal.' },
  { id: 5, title: 'Guest Lecture on AI & Machine Learning', date: '2026-09-12', type: 'event', content: 'Department of CSE invites students to a guest lecture on "Recent Trends in AI & ML" by Dr. Rajesh Kumar, IIT Kharagpur.' },
  { id: 6, title: 'Scholarship Applications Open', date: '2026-08-20', type: 'academic', content: 'Merit-cum-means scholarship applications for 2026-27 are now open. Apply through the student portal before September 30.' },
  { id: 7, title: 'Independence Day Celebration', date: '2026-08-15', type: 'event', content: 'Flag hoisting ceremony at 9:00 AM in the main auditorium. All students and faculty are requested to attend.' },
  { id: 8, title: 'New Library Timings', date: '2026-08-10', type: 'academic', content: 'Library hours extended to 10 PM during examination period. Weekend hours: 8 AM - 6 PM.' },
];

export const events = [
  { id: 1, title: 'Innovision 2026 — Annual Tech Fest', date: '2026-09-20', endDate: '2026-09-22', type: 'tech-fest', description: 'Three-day annual technical festival with hackathons, robotics competitions, and cultural performances.' },
  { id: 2, title: 'Industry-Academia Conclave', date: '2026-10-05', type: 'conference', description: 'Annual conclave bringing together industry leaders and academicians to discuss future of engineering education.' },
  { id: 3, title: ' Campus Recruitment — Infosys', date: '2026-10-15', type: 'placement', description: 'Infosys recruitment drive for final year B.Tech students across all branches.' },
  { id: 4, title: 'Sports Week', date: '2026-11-01', endDate: '2026-11-07', type: 'cultural', description: 'Inter-department sports competition including cricket, football, basketball, badminton, and athletics.' },
  { id: 5, title: 'Technical Paper Presentation', date: '2026-09-21', type: 'tech-fest', description: 'Present your research papers on emerging technologies. Best paper awards worth ₹25,000.' },
  { id: 6, title: 'Hackathon 2026', date: '2026-09-20', type: 'tech-fest', description: '36-hour hackathon with ₹50,000 prize pool. Teams of 2-4 members. Theme: Smart Campus.' },
  { id: 7, title: 'Alumni Meet 2026', date: '2026-12-20', type: 'cultural', description: 'Annual alumni reunion. Connect with 10,000+ UEM alumni working across the globe.' },
  { id: 8, title: 'Farewell Party — Batch of 2026', date: '2027-05-10', type: 'cultural', description: 'Farewell celebration for graduating students. Cultural performances, awards, and memories.' },
];

export const faculty = [
  { id: 1, name: 'Dr. Amitava Ghosh', department: 'CSE', designation: 'Professor & Head', qualification: 'Ph.D (IIT Kharagpur)', experience: '22 years' },
  { id: 2, name: 'Dr. Suchismita Das', department: 'ECE', designation: 'Professor', qualification: 'Ph.D (Jadavpur University)', experience: '18 years' },
  { id: 3, name: 'Dr. Rana Majumder', department: 'EE', designation: 'Professor & Head', qualification: 'Ph.D (NIT Durgapur)', experience: '20 years' },
  { id: 4, name: 'Dr. Arup Kumar Mitra', department: 'ME', designation: 'Professor', qualification: 'Ph.D (BESU Shibpur)', experience: '19 years' },
  { id: 5, name: 'Dr. Priya Banerjee', department: 'MBA', designation: 'Professor & Head', qualification: 'Ph.D (IIM Calcutta)', experience: '15 years' },
  { id: 6, name: 'Dr. Sankar Nath Das', department: 'CSE', designation: 'Associate Professor', qualification: 'Ph.D (NIT Rourkela)', experience: '12 years' },
  { id: 7, name: 'Prof. (Dr.) Rajib Bandopadhyay', department: 'CE', designation: 'Professor & Head', qualification: 'Ph.D (JU)', experience: '25 years' },
  { id: 8, name: 'Dr. Dipanwita Das', department: 'CSE', designation: 'Assistant Professor', qualification: 'Ph.D (IIEST Shibpur)', experience: '8 years' },
  { id: 9, name: 'Dr. Subrata Dasgupta', department: 'CSE', designation: 'Associate Professor', qualification: 'Ph.D (IIT Delhi)', experience: '14 years' },
  { id: 10, name: 'Dr. Arpita Ghosh', department: 'ECE', designation: 'Assistant Professor', qualification: 'Ph.D (NIT Silchar)', experience: '6 years' },
  { id: 11, name: 'Prof. Manas Kumar Sanyal', department: 'EE', designation: 'Professor', qualification: 'Ph.D (IIT Kharagpur)', experience: '23 years' },
  { id: 12, name: 'Dr. Anindya Bose', department: 'ME', designation: 'Associate Professor', qualification: 'Ph.D (IIT ISM Dhanbad)', experience: '11 years' },
];

export const placements = {
  year: 2025, totalStudents: 480, placed: 456, rate: 95,
  topRecruiters: [
    { name: 'TCS', offers: 120 }, { name: 'Infosys', offers: 85 }, { name: 'Wipro', offers: 65 },
    { name: 'Cognizant', offers: 55 }, { name: 'Accenture', offers: 40 }, { name: 'IBM', offers: 30 },
    { name: 'Capgemini', offers: 25 }, { name: 'HCL', offers: 20 }, { name: 'Tech Mahindra', offers: 18 },
    { name: 'L&T Infotech', offers: 15 }, { name: 'Mindtree', offers: 12 }, { name: 'Amazon', offers: 5 },
  ],
  highestPackage: '42 LPA', averagePackage: '6.5 LPA',
};

export const academicCalendar = [
  { id: 1, event: 'Fall 2026 Semester Begins', date: '2026-08-01', type: 'semester' },
  { id: 2, event: 'Last Date for Semester Registration', date: '2026-09-10', type: 'deadline' },
  { id: 3, event: 'Mid-Semester Examinations Begin', date: '2026-10-01', type: 'exam' },
  { id: 4, event: 'Mid-Semester Exams End', date: '2026-10-10', type: 'exam' },
  { id: 5, event: 'Puja Break', date: '2026-10-15', endDate: '2026-10-25', type: 'holiday' },
  { id: 6, event: 'End-Semester Examinations Begin', date: '2026-11-20', type: 'exam' },
  { id: 7, event: 'End-Semester Exams End', date: '2026-12-10', type: 'exam' },
  { id: 8, event: 'Winter Break', date: '2026-12-15', endDate: '2027-01-05', type: 'holiday' },
  { id: 9, event: 'Spring 2027 Semester Begins', date: '2027-01-10', type: 'semester' },
  { id: 10, event: 'Republic Day Holiday', date: '2027-01-26', type: 'holiday' },
  { id: 11, event: 'Annual Day Celebration', date: '2027-02-15', type: 'event' },
  { id: 12, event: 'Placement Season Begins', date: '2027-03-01', type: 'placement' },
  { id: 13, event: 'Semester Ends', date: '2027-05-15', type: 'semester' },
  { id: 14, event: 'Summer Vacations Begin', date: '2027-05-16', endDate: '2027-07-15', type: 'holiday' },
  { id: 15, event: 'Independence Day Holiday', date: '2026-08-15', type: 'holiday' },
  { id: 16, event: 'Teachers Day Celebration', date: '2026-09-05', type: 'event' },
  { id: 17, event: 'Gandhi Jayanti Holiday', date: '2026-10-02', type: 'holiday' },
];

export const research = [
  { id: 1, title: 'Deep Learning for Medical Image Analysis', PI: 'Dr. Amitava Ghosh', department: 'CSE', funding: 'DST SERB', amount: '₹25 Lakhs', status: 'Ongoing', year: 2024 },
  { id: 2, title: 'Smart Grid Energy Management Systems', PI: 'Dr. Rana Majumder', department: 'EE', funding: 'AICTE', amount: '₹18 Lakhs', status: 'Ongoing', year: 2025 },
  { id: 3, title: 'IoT-Based Water Quality Monitoring', PI: 'Dr. Suchismita Das', department: 'ECE', funding: 'DST', amount: '₹12 Lakhs', status: 'Completed', year: 2023 },
  { id: 4, title: 'Sustainable Construction Materials', PI: 'Prof. (Dr.) Rajib Bandopadhyay', department: 'CE', funding: 'UGC', amount: '₹15 Lakhs', status: 'Ongoing', year: 2024 },
  { id: 5, title: 'AI-Driven Supply Chain Optimization', PI: 'Dr. Priya Banerjee', department: 'MBA', funding: 'AICTE', amount: '₹8 Lakhs', status: 'Completed', year: 2023 },
  { id: 6, title: 'Renewable Energy Integration in Microgrids', PI: 'Dr. Rana Majumder', department: 'EE', funding: 'MNRE', amount: '₹30 Lakhs', status: 'Ongoing', year: 2025 },
  { id: 7, title: 'Natural Language Processing for Bengali', PI: 'Dr. Subrata Dasgupta', department: 'CSE', funding: 'DST SERB', amount: '₹20 Lakhs', status: 'Ongoing', year: 2025 },
  { id: 8, title: 'Autonomous Vehicle Navigation Systems', PI: 'Dr. Arup Kumar Mitra', department: 'ME', funding: 'AICTE', amount: '₹22 Lakhs', status: 'Ongoing', year: 2024 },
];

export const campus = {
  name: 'UEM Kolkata — Action Area III Campus',
  address: 'Action Area III, New Town, Kolkata, West Bengal 700156, India',
  established: 2001, area: '50 acres',
  facilities: [
    { name: 'Central Library', description: 'Over 80,000 volumes, digital access to IEEE, Springer, and Elsevier journals', icon: 'fa-book' },
    { name: 'Computer Labs', description: '12 state-of-the-art labs with 800+ workstations and high-speed internet', icon: 'fa-desktop' },
    { name: 'Auditorium', description: '500-seat auditorium with modern audio-visual equipment', icon: 'fa-theater-masks' },
    { name: 'Sports Complex', description: 'Indoor and outdoor facilities for cricket, football, basketball, badminton, and gym', icon: 'fa-running' },
    { name: 'Hostels', description: 'Separate hostels for boys and girls with Wi-Fi, mess, and 24/7 security', icon: 'fa-home' },
    { name: 'Cafeteria', description: 'Multi-cuisine cafeteria and juice bar serving 2000+ students daily', icon: 'fa-utensils' },
    { name: 'Medical Center', description: 'On-campus medical center with ambulance facility and tie-up with nearest hospital', icon: 'fa-medkit' },
    { name: 'Innovation Lab', description: 'Dedicated space for robotics, 3D printing, and IoT prototyping', icon: 'fa-flask' },
    { name: 'Seminar Hall', description: '200-capacity hall for workshops, guest lectures, and faculty meetings', icon: 'fa-chalkboard-teacher' },
    { name: 'Open Air Theatre', description: 'Amphitheatre for cultural events, performances, and student gatherings', icon: 'fa-music' },
  ],
  departments: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'MBA', 'MCA', 'BCA', 'BBA', 'B.Sc', 'Ph.D'],
};

export const users = [
  { id: 1, email: 'student@uem.edu.in', password: 'student123', name: 'Rahul Sharma', roll: 'UEM-2023-CSE-001', department: 'CSE', semester: 5, cgpa: 8.7 },
  { id: 2, email: 'admin@uem.edu.in', password: 'admin123', name: 'Admin User', roll: 'ADMIN-001', department: 'Administration', semester: 0, cgpa: 0 },
];
