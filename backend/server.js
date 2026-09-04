import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// ── Synthetic Data ────────────────────────────────────────
const programs = [
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

const stats = {
  established: 2001,
  departments: 12,
  students: 5500,
  faculty: 350,
  placementRate: 95,
  recruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Capgemini', 'HCL', 'Tech Mahindra', 'L&T Infotech'],
  ranking: { nirf: 152, outlook: 45, indiaToday: 38 },
  campus: { area: '50 acres', buildings: 8, labs: 12, libraries: 1 },
};

const notices = [
  { id: 1, title: 'Fall 2026 Semester Registration Open', date: '2026-08-15', type: 'academic', content: 'Online registration for Fall 2026 semester is now open. Last date to register: September 10, 2026.' },
  { id: 2, title: 'Campus Placement Drive — TCS', date: '2026-09-05', type: 'placement', content: 'TCS will be conducting a campus placement drive for B.Tech CSE, IT, and ECE students. Eligibility: CGPA >= 6.0.' },
  { id: 3, title: 'Annual Tech Fest — Innovision 2026', date: '2026-09-20', type: 'event', content: 'Innovision 2026, the annual technical festival of UEM, will be held from September 20-22. Events include hackathon, robotics, paper presentation, and more.' },
  { id: 4, title: 'Mid-Semester Exam Schedule', date: '2026-09-10', type: 'academic', content: 'Mid-semester examinations will begin from October 1, 2026. Detailed schedule will be uploaded on the student portal.' },
  { id: 5, title: 'Guest Lecture on AI & Machine Learning', date: '2026-09-12', type: 'event', content: 'Department of CSE invites students to a guest lecture on "Recent Trends in AI & ML" by Dr. Rajesh Kumar, IIT Kharagpur.' },
  { id: 6, title: 'Scholarship Applications Open', date: '2026-08-20', type: 'academic', content: 'Merit-cum-means scholarship applications for 2026-27 are now open. Apply through the student portal before September 30.' },
  { id: 7, title: 'Independence Day Celebration', date: '2026-08-15', type: 'event', content: 'Flag hoisting ceremony at 9:00 AM in the main auditorium. All students and faculty are requested to attend.' },
  { id: 8, title: 'New Library Timings', date: '2026-08-10', type: 'academic', content: 'Library hours extended to 10 PM during examination period. Weekend hours: 8 AM - 6 PM.' },
];

const events = [
  { id: 1, title: 'Innovision 2026 — Annual Tech Fest', date: '2026-09-20', endDate: '2026-09-22', type: 'tech-fest', description: 'Three-day annual technical festival with hackathons, robotics competitions, and cultural performances.' },
  { id: 2, title: 'Industry-Academia Conclave', date: '2026-10-05', type: 'conference', description: 'Annual conclave bringing together industry leaders and academicians to discuss future of engineering education.' },
  { id: 3, title: ' Campus Recruitment — Infosys', date: '2026-10-15', type: 'placement', description: 'Infosys recruitment drive for final year B.Tech students across all branches.' },
  { id: 4, title: 'Sports Week', date: '2026-11-01', endDate: '2026-11-07', type: 'cultural', description: 'Inter-department sports competition including cricket, football, basketball, badminton, and athletics.' },
];

const faculty = [
  { id: 1, name: 'Dr. Amitava Ghosh', department: 'CSE', designation: 'Professor & Head', qualification: 'Ph.D (IIT Kharagpur)', experience: '22 years' },
  { id: 2, name: 'Dr. Suchismita Das', department: 'ECE', designation: 'Professor', qualification: 'Ph.D (Jadavpur University)', experience: '18 years' },
  { id: 3, name: 'Dr. Rana Majumder', department: 'EE', designation: 'Professor & Head', qualification: 'Ph.D (NIT Durgapur)', experience: '20 years' },
  { id: 4, name: 'Dr. Arup Kumar Mitra', department: 'ME', designation: 'Professor', qualification: 'Ph.D (BESU Shibpur)', experience: '19 years' },
  { id: 5, name: 'Dr. Priya Banerjee', department: 'MBA', designation: 'Professor & Head', qualification: 'Ph.D (IIM Calcutta)', experience: '15 years' },
  { id: 6, name: 'Dr. Sankar Nath Das', department: 'CSE', designation: 'Associate Professor', qualification: 'Ph.D (NIT Rourkela)', experience: '12 years' },
  { id: 7, name: 'Prof. (Dr.) Rajib Bandopadhyay', department: 'CE', designation: 'Professor & Head', qualification: 'Ph.D (JU)', experience: '25 years' },
  { id: 8, name: 'Dr. Dipanwita Das', department: 'CSE', designation: 'Assistant Professor', qualification: 'Ph.D (IIEST Shibpur)', experience: '8 years' },
];

const placements = {
  year: 2025,
  totalStudents: 480,
  placed: 456,
  rate: 95,
  topRecruiters: [
    { name: 'TCS', offers: 120 },
    { name: 'Infosys', offers: 85 },
    { name: 'Wipro', offers: 65 },
    { name: 'Cognizant', offers: 55 },
    { name: 'Accenture', offers: 40 },
    { name: 'IBM', offers: 30 },
    { name: 'Capgemini', offers: 25 },
    { name: 'HCL', offers: 20 },
  ],
  highestPackage: '42 LPA',
  averagePackage: '6.5 LPA',
};

// ── Synthetic Data (continued) ─────────────────────────────
const academicCalendar = [
  { id: 1, event: 'Fall 2026 Semester Begins', date: '2026-08-01', type: 'semester' },
  { id: 2, event: 'Last Date for Semester Registration', date: '2026-09-10', type: 'deadline' },
  { id: 3, event: 'Mid-Semester Examinations Begin', date: '2026-10-01', type: 'exam' },
  { id: 4, event: 'Mid-Semester Exams End', date: '2026-10-10', type: 'exam' },
  { id: 5, event: 'Di vacances (Puja Break)', date: '2026-10-15', endDate: '2026-10-25', type: 'holiday' },
  { id: 6, event: 'End-Semester Examinations Begin', date: '2026-11-20', type: 'exam' },
  { id: 7, event: 'End-Semester Exams End', date: '2026-12-10', type: 'exam' },
  { id: 8, event: 'Winter Break', date: '2026-12-15', endDate: '2027-01-05', type: 'holiday' },
  { id: 9, event: 'Spring 2027 Semester Begins', date: '2027-01-10', type: 'semester' },
  { id: 10, event: 'Republic Day Holiday', date: '2027-01-26', type: 'holiday' },
  { id: 11, event: 'Annual Day Celebration', date: '2027-02-15', type: 'event' },
  { id: 12, event: 'Placement Season Begins', date: '2027-03-01', type: 'placement' },
  { id: 13, event: 'Semester Ends', date: '2027-05-15', type: 'semester' },
  { id: 14, event: 'Summer Vacations Begin', date: '2027-05-16', endDate: '2027-07-15', type: 'holiday' },
];

const research = [
  { id: 1, title: 'Deep Learning for Medical Image Analysis', PI: 'Dr. Amitava Ghosh', department: 'CSE', funding: 'DST SERB', amount: '₹25 Lakhs', status: 'Ongoing', year: 2024 },
  { id: 2, title: 'Smart Grid Energy Management Systems', PI: 'Dr. Rana Majumder', department: 'EE', funding: 'AICTE', amount: '₹18 Lakhs', status: 'Ongoing', year: 2025 },
  { id: 3, title: 'IoT-Based Water Quality Monitoring', PI: 'Dr. Suchismita Das', department: 'ECE', funding: 'DST', amount: '₹12 Lakhs', status: 'Completed', year: 2023 },
  { id: 4, title: 'Sustainable Construction Materials', PI: 'Prof. (Dr.) Rajib Bandopadhyay', department: 'CE', funding: 'UGC', amount: '₹15 Lakhs', status: 'Ongoing', year: 2024 },
  { id: 5, title: 'AI-Driven Supply Chain Optimization', PI: 'Dr. Priya Banerjee', department: 'MBA', funding: 'AICTE', amount: '₹8 Lakhs', status: 'Completed', year: 2023 },
  { id: 6, title: 'Renewable Energy Integration in Microgrids', PI: 'Dr. Rana Majumder', department: 'EE', funding: 'MNRE', amount: '₹30 Lakhs', status: 'Ongoing', year: 2025 },
];

const campus = {
  name: 'UEM Kolkata — Action Area III Campus',
  address: 'Action Area III, New Town, Kolkata, West Bengal 700156, India',
  established: 2001,
  area: '50 acres',
  facilities: [
    { name: 'Central Library', description: 'Over 80,000 volumes, digital access to IEEE, Springer, and Elsevier journals', icon: 'fa-book' },
    { name: 'Computer Labs', description: '12 state-of-the-art labs with 800+ workstations and high-speed internet', icon: 'fa-desktop' },
    { name: 'Auditorium', description: '500-seat auditorium with modern audio-visual equipment', icon: 'fa-theater-masks' },
    { name: 'Sports Complex', description: 'Indoor and outdoor facilities for cricket, football, basketball, badminton, and gym', icon: 'fa-running' },
    { name: 'Hostels', description: 'Separate hostels for boys and girls with Wi-Fi, mess, and 24/7 security', icon: 'fa-home' },
    { name: 'Cafeteria', description: 'Multi-cuisine cafeteria and juice bar serving 2000+ students daily', icon: 'fa-utensils' },
    { name: 'Medical Center', description: 'On-campus medical center with ambulance facility and tie-up with nearest hospital', icon: 'fa-medkit' },
    { name: 'Innovation Lab', description: 'Dedicated space for robotics, 3D printing, and IoT prototyping', icon: 'fa-flask' },
  ],
  departments: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'MBA', 'MCA', 'BCA', 'BBA', 'B.Sc', 'Ph.D'],
};

const privacyPolicy = {
  lastUpdated: '2026-08-01',
  sections: [
    { title: 'Information We Collect', content: 'We collect personal information such as name, email address, phone number, and academic records when you apply for admission or register for programs. We also collect usage data including IP address, browser type, and pages visited to improve our services.' },
    { title: 'How We Use Your Information', content: 'Your information is used to process admissions, communicate about academic matters, send university notifications, improve our website and services, and comply with legal obligations.' },
    { title: 'Data Sharing', content: 'We do not sell or rent personal information to third parties. Data may be shared with government bodies for regulatory compliance, accredited agencies for quality assurance, and technology service providers who assist in operating our systems under strict confidentiality agreements.' },
    { title: 'Data Security', content: 'We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal information from unauthorized access, disclosure, or misuse.' },
    { title: 'Cookies', content: 'Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data. To exercise these rights, please contact the university data protection officer at privacy@uem.edu.in.' },
    { title: 'Contact', content: 'For questions about this privacy policy, contact: Data Protection Officer, UEM Kolkata, Action Area III, New Town, Kolkata 700156. Email: privacy@uem.edu.in' },
  ],
};

// ── API Routes ────────────────────────────────────────────
const api = express.Router();

api.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

api.get('/stats', (_req, res) => {
  res.json(stats);
});

api.get('/programs', (req, res) => {
  const { degree } = req.query;
  let result = programs;
  if (degree) {
    result = programs.filter(p => p.degree.toLowerCase() === degree.toLowerCase());
  }
  res.json(result);
});

api.get('/programs/:id', (req, res) => {
  const program = programs.find(p => p.id === Number(req.params.id));
  if (!program) return res.status(404).json({ error: 'Program not found' });
  res.json(program);
});

api.get('/notices', (_req, res) => {
  res.json(notices);
});

api.get('/events', (_req, res) => {
  res.json(events);
});

api.get('/faculty', (req, res) => {
  const { department } = req.query;
  let result = faculty;
  if (department) {
    result = faculty.filter(f => f.department.toLowerCase() === department.toLowerCase());
  }
  res.json(result);
});

api.get('/placements', (_req, res) => {
  res.json(placements);
});

api.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ programs: [], notices: [], events: [] });

  const matchedPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
  );
  const matchedNotices = notices.filter(n =>
    n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
  const matchedEvents = events.filter(e =>
    e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  );

  res.json({ programs: matchedPrograms, notices: matchedNotices, events: matchedEvents });
});

api.get('/academic-calendar', (_req, res) => {
  res.json(academicCalendar);
});

api.get('/research', (_req, res) => {
  res.json(research);
});

api.get('/campus', (_req, res) => {
  res.json(campus);
});

api.get('/privacy-policy', (_req, res) => {
  res.json(privacyPolicy);
});

api.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  console.log(`[Contact] ${name} <${email}> — ${subject || 'No subject'}: ${message.slice(0, 100)}`);
  res.json({ success: true, message: 'Thank you for reaching out. We will get back to you within 2-3 business days.' });
});

api.post('/apply', (req, res) => {
  const { name, email, phone, program, qualification } = req.body;
  if (!name || !email || !program) {
    return res.status(400).json({ error: 'Name, email, and program are required.' });
  }
  const appId = 'UEM' + Date.now().toString(36).toUpperCase();
  console.log(`[Apply] ${appId}: ${name} <${email}> — ${program}`);
  res.json({ success: true, applicationId: appId, message: `Application ${appId} submitted successfully. You will receive a confirmation email shortly.` });
});

// ── Auth + Student Data ───────────────────────────────────
const crypto = await import('crypto');
const hash = (pw) => crypto.createHash('sha256').update(pw).digest('hex');

const users = new Map();
const sessions = new Map();

// Seed a demo student
const demoId = 'UEM/2023/CSE/401';
users.set(demoId, { id: demoId, name: 'Amit Sharma', email: 'amit.shashorst@uem.edu.in', phone: '9876543210', password: hash('uem123'), department: 'CSE', semester: 5, program: 'B.Tech Computer Science & Engineering', admissionYear: 2023, dob: '2004-05-12', gender: 'Male', bloodGroup: 'B+', address: 'Salt Lake, Kolkata', cgpa: 8.2, backlogs: 0 });

// ponytail: in-memory stores, no persistence. Upgrade: SQLite/Postgres.
const grades = new Map();
const attendance = new Map();
const fees = new Map();
const timetable = new Map();
const libraryBooks = new Map();

// Grade data for demo student
grades.set(demoId, [
  { sem: 3, subjects: [{ code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A' }, { code: 'CS302', name: 'OOP with Java', credits: 3, grade: 'A+' }, { code: 'CS303', name: 'Digital Electronics', credits: 3, grade: 'B+' }, { code: 'MA301', name: 'Linear Algebra', credits: 3, grade: 'A' }, { code: 'CS304', name: 'DBMS Lab', credits: 2, grade: 'A+' }], semGpa: 9.0 },
  { sem: 4, subjects: [{ code: 'CS401', name: 'Algorithms', credits: 4, grade: 'A+' }, { code: 'CS402', name: 'Operating Systems', credits: 3, grade: 'A' }, { code: 'CS403', name: 'Computer Networks', credits: 3, grade: 'B+' }, { code: 'MA401', name: 'Probability & Statistics', credits: 3, grade: 'A' }, { code: 'CS404', name: 'OS Lab', credits: 2, grade: 'A' }], semGpa: 8.7 },
  { sem: 5, subjects: [{ code: 'CS501', name: 'Compiler Design', credits: 3, grade: 'A' }, { code: 'CS502', name: 'Software Engineering', credits: 3, grade: 'B+' }, { code: 'CS503', name: 'Web Technologies', credits: 3, grade: 'A+' }, { code: 'CS504', name: 'AI & ML Fundamentals', credits: 3, grade: 'A' }, { code: 'CS505', name: 'Mini Project', credits: 2, grade: 'A+' }], semGpa: 8.8 },
]);

// Attendance for demo student
attendance.set(demoId, { overall: 87, subjects: [
  { code: 'CS501', name: 'Compiler Design', total: 40, attended: 35 },
  { code: 'CS502', name: 'Software Engineering', total: 40, attended: 33 },
  { code: 'CS503', name: 'Web Technologies', total: 40, attended: 38 },
  { code: 'CS504', name: 'AI & ML Fundamentals', total: 40, attended: 34 },
  { code: 'CS505', name: 'Mini Project', total: 20, attended: 19 },
]});

// Fee data
fees.set(demoId, [
  { sem: 5, amount: 125000, paid: 125000, status: 'paid', date: '2026-08-15', receiptNo: 'UEM/RCPT/2026/0847' },
  { sem: 6, amount: 125000, paid: 0, status: 'pending', dueDate: '2027-01-15' },
]);

// Timetable
timetable.set(demoId, [
  { time: '09:00 - 09:50', mon: { subject: 'Compiler Design', room: 'A-301', type: 'Lecture' }, tue: { subject: 'Software Engineering', room: 'A-301', type: 'Lecture' }, wed: { subject: 'AI & ML Fundamentals', room: 'B-201', type: 'Lecture' }, thu: { subject: 'Compiler Design', room: 'A-301', type: 'Tutorial' }, fri: { subject: 'Web Technologies', room: 'C-105', type: 'Lab' } },
  { time: '10:00 - 10:50', mon: { subject: 'Software Engineering', room: 'A-301', type: 'Lecture' }, tue: { subject: 'AI & ML Fundamentals', room: 'B-201', type: 'Lecture' }, wed: { subject: 'Web Technologies', room: 'C-105', type: 'Lecture' }, thu: { subject: 'Software Engineering', room: 'A-301', type: 'Lab' }, fri: { subject: 'Mini Project', room: 'D-102', type: 'Project' } },
  { time: '11:00 - 11:50', mon: { subject: 'AI & ML Fundamentals', room: 'B-201', type: 'Lecture' }, tue: { subject: 'Web Technologies', room: 'C-105', type: 'Lecture' }, wed: { subject: 'Mini Project', room: 'D-102', type: 'Project' }, thu: { subject: 'AI & ML Fundamentals', room: 'B-201', type: 'Lab' }, fri: { subject: 'Compiler Design', room: 'A-301', type: 'Lecture' } },
  { time: '12:00 - 12:50', mon: null, tue: null, wed: null, thu: null, fri: null },
  { time: '14:00 - 14:50', mon: { subject: 'Mini Project', room: 'D-102', type: 'Project' }, tue: { subject: 'Mini Project', room: 'D-102', type: 'Project' }, wed: null, thu: null, fri: null },
]);

// Library books issued
libraryBooks.set(demoId, [
  { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen et al.', issued: '2026-08-01', due: '2026-08-30', status: 'returned' },
  { title: 'Database System Concepts', author: 'Silberschatz', issued: '2026-08-15', due: '2026-09-15', status: 'issued' },
  { title: 'Computer Networks (Tanenbaum)', author: 'Tanenbaum', issued: '2026-08-20', due: '2026-09-20', status: 'issued' },
]);

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Unauthorized' });
  req.user = sessions.get(token);
  next();
}

const gradePoints = { 'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5, 'F': 0 };

api.post('/auth/register', (req, res) => {
  const { name, email, phone, password, department, program } = req.body;
  if (!name || !email || !password || !department || !program) return res.status(400).json({ error: 'All fields are required.' });
  for (const [id, u] of users) { if (u.email === email) return res.status(409).json({ error: 'Email already registered.' }); }
  const deptCode = { CSE: 'CSE', ECE: 'ECE', EE: 'EE', ME: 'ME', CE: 'CE', IT: 'IT', MBA: 'MBA', MCA: 'MCA' }[department] || department.toUpperCase();
  const year = new Date().getFullYear();
  const seq = String(users.size + 1).padStart(3, '0');
  const id = `UEM/${year}/${deptCode}/${seq}`;
  users.set(id, { id, name, email, phone, password: hash(password), department: deptCode, semester: 1, program, admissionYear: year, dob: '', gender: '', bloodGroup: '', address: '', cgpa: 0, backlogs: 0 });
  const token = crypto.randomUUID();
  sessions.set(token, { id, name, role: 'student' });
  console.log(`[Register] ${name} <${email}> → ${id}`);
  res.json({ success: true, token, user: { id, name, department: deptCode, semester: 1 } });
});

api.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });
  let found = null;
  for (const [id, u] of users) { if (id === username || u.email === username) { found = { id, ...u }; break; } }
  if (!found || found.password !== hash(password)) return res.status(401).json({ error: 'Invalid credentials.' });
  const token = crypto.randomUUID();
  sessions.set(token, { id: found.id, name: found.name, role: 'student' });
  res.json({ success: true, token, user: { id: found.id, name: found.name, department: found.department, semester: found.semester, program: found.program } });
});

api.post('/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ success: true });
});

api.get('/student/profile', authMiddleware, (req, res) => {
  const u = users.get(req.user.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  const { password, ...safe } = u;
  res.json(safe);
});

api.get('/student/grades', authMiddleware, (req, res) => {
  const data = grades.get(req.user.id) || [];
  const totalCredits = data.flatMap(s => s.subjects).reduce((a, b) => a + b.credits, 0);
  const totalPoints = data.flatMap(s => s.subjects).reduce((a, b) => a + b.credits * (gradePoints[b.grade] || 0), 0);
  const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  res.json({ semesters: data, cgpa: Number(cgpa), totalCredits });
});

api.get('/student/attendance', authMiddleware, (req, res) => {
  res.json(attendance.get(req.user.id) || { overall: 0, subjects: [] });
});

api.get('/student/fees', authMiddleware, (req, res) => {
  res.json(fees.get(req.user.id) || []);
});

api.get('/student/timetable', authMiddleware, (req, res) => {
  res.json(timetable.get(req.user.id) || []);
});

api.get('/student/library', authMiddleware, (req, res) => {
  res.json(libraryBooks.get(req.user.id) || []);
});

api.get('/student/dashboard', authMiddleware, (req, res) => {
  const u = users.get(req.user.id);
  const g = grades.get(req.user.id) || [];
  const a = attendance.get(req.user.id);
  const f = fees.get(req.user.id) || [];
  const pendingFee = f.filter(x => x.status === 'pending').reduce((sum, x) => sum + x.amount, 0);
  const latestSem = g[g.length - 1];
  res.json({
    name: u.name, id: u.id, department: u.department, semester: u.semester, program: u.program,
    cgpa: latestSem?.semGpa || 0, attendance: a?.overall || 0,
    pendingFee, nextDue: f.find(x => x.status === 'pending')?.dueDate || '',
    recentGrades: latestSem?.subjects || [],
  });
});

app.use('/api', api);

// ── Serve Frontend ────────────────────────────────────────
import { existsSync } from 'fs';
const distPath = join(__dirname, '..', 'frontend', 'dist');
const devPath = join(__dirname, '..', 'frontend');
const staticPath = existsSync(distPath) ? distPath : devPath;
app.use(express.static(staticPath));
app.get('*', (_req, res) => {
  res.sendFile(join(staticPath, 'index.html'));
});

// ── Error Handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UEM Backend running on http://localhost:${PORT}`);
  console.log(`API endpoints available at /api/*`);
  console.log(`Demo student: UEM/2023/CSE/401 / uem123`);
});
