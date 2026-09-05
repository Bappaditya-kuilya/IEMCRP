import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import Database from 'better-sqlite3';
import crypto from 'crypto';

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

// ── Database ──────────────────────────────────────────────
const dbPath = join(__dirname, 'data', 'uemcrp.db');
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Init schema + seed
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
db.exec(schema);

const programCount = db.prepare('SELECT COUNT(*) as c FROM programs').get();
if (programCount.c === 0) {
  db.transaction(() => db.exec(seed))();
  console.log('[DB] Seeded fresh database');
} else {
  console.log('[DB] Connected to existing database');
}

// ── Helpers ───────────────────────────────────────────────
const hash = (pw) => crypto.createHash('sha256').update(pw).digest('hex');
const gradePoints = { 'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5, 'F': 0 };

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  req.user = session;
  next();
}

// ── API Routes ────────────────────────────────────────────
const api = express.Router();

api.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

api.get('/stats', (_req, res) => {
  const p = db.prepare('SELECT COUNT(*) as c FROM programs').get();
  const f = db.prepare('SELECT COUNT(*) as c FROM faculty').get();
  res.json({
    established: 2001,
    departments: 12,
    students: 5500,
    faculty: f.c,
    placementRate: 95,
    recruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Capgemini', 'HCL', 'Tech Mahindra', 'L&T Infotech'],
    ranking: { nirf: 152, outlook: 45, indiaToday: 38 },
    campus: { area: '50 acres', buildings: 8, labs: 12, libraries: 1 },
  });
});

api.get('/programs', (req, res) => {
  const { degree } = req.query;
  if (degree) {
    res.json(db.prepare('SELECT * FROM programs WHERE lower(degree) = lower(?)').all(degree));
  } else {
    res.json(db.prepare('SELECT * FROM programs').all());
  }
});

api.get('/programs/:id', (req, res) => {
  const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
  if (!program) return res.status(404).json({ error: 'Program not found' });
  res.json(program);
});

api.get('/notices', (_req, res) => {
  res.json(db.prepare('SELECT * FROM notices ORDER BY date DESC').all());
});

api.get('/events', (_req, res) => {
  res.json(db.prepare('SELECT * FROM events ORDER BY date ASC').all());
});

api.get('/faculty', (req, res) => {
  const { department } = req.query;
  if (department) {
    res.json(db.prepare('SELECT * FROM faculty WHERE lower(department) = lower(?)').all(department));
  } else {
    res.json(db.prepare('SELECT * FROM faculty').all());
  }
});

api.get('/placements', (_req, res) => {
  const p = db.prepare('SELECT * FROM placements ORDER BY year DESC LIMIT 1').get();
  if (!p) return res.json({});
  const recruiters = db.prepare('SELECT name, offers FROM top_recruiters WHERE placement_id = ? ORDER BY offers DESC').all(p.id);
  res.json({ ...p, topRecruiters: recruiters });
});

api.get('/search', (req, res) => {
  const q = `%${(req.query.q || '').toLowerCase()}%`;
  if (q === '%%') return res.json({ programs: [], notices: [], events: [] });
  const programs = db.prepare('SELECT * FROM programs WHERE lower(name) LIKE ? OR lower(department) LIKE ?').all(q, q);
  const notices = db.prepare('SELECT * FROM notices WHERE lower(title) LIKE ? OR lower(content) LIKE ?').all(q, q);
  const events = db.prepare('SELECT * FROM events WHERE lower(title) LIKE ? OR lower(description) LIKE ?').all(q, q);
  res.json({ programs, notices, events });
});

api.get('/academic-calendar', (_req, res) => {
  res.json(db.prepare('SELECT * FROM academic_calendar ORDER BY date ASC').all());
});

api.get('/research', (_req, res) => {
  res.json(db.prepare('SELECT * FROM research ORDER BY year DESC').all());
});

api.get('/campus', (_req, res) => {
  const c = db.prepare('SELECT * FROM campus LIMIT 1').get();
  if (!c) return res.json({});
  const facilities = db.prepare('SELECT name, description, icon FROM campus_facilities WHERE campus_id = ?').all(c.id);
  res.json({ ...c, facilities });
});

api.get('/privacy-policy', (_req, res) => {
  const p = db.prepare('SELECT * FROM privacy_policy LIMIT 1').get();
  if (!p) return res.json({});
  const sections = db.prepare('SELECT title, content FROM privacy_policy_sections WHERE policy_id = ?').all(p.id);
  res.json({ lastUpdated: p.last_updated, sections });
});

api.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required.' });
  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address.' });
  if (message.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  db.prepare('INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject || null, message);
  res.json({ success: true, message: 'Thank you for reaching out. We will get back to you within 2-3 business days.' });
});

api.post('/apply', (req, res) => {
  const { name, email, phone, program, qualification } = req.body;
  if (!name || !email || !program) return res.status(400).json({ error: 'Name, email, and program are required.' });
  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address.' });
  if (name.length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  const appId = 'UEM' + Date.now().toString(36).toUpperCase();
  db.prepare('INSERT INTO applications (app_id, name, email, phone, program, qualification) VALUES (?, ?, ?, ?, ?, ?)').run(appId, name, email, phone || null, program, qualification || null);
  res.json({ success: true, applicationId: appId, message: `Application ${appId} submitted successfully. You will receive a confirmation email shortly.` });
});

// ── Auth ──────────────────────────────────────────────────
api.post('/auth/register', (req, res) => {
  const { name, email, phone, password, department, program } = req.body;
  if (!name || !email || !password || !department || !program) return res.status(400).json({ error: 'All fields are required.' });
  if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters.' });
  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address.' });

  const deptCode = { CSE: 'CSE', ECE: 'ECE', EE: 'EE', ME: 'ME', CE: 'CE', IT: 'IT', MBA: 'MBA', MCA: 'MCA' }[department] || department.toUpperCase();
  const year = new Date().getFullYear();

  let id;
  try {
    id = db.transaction(() => {
      const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
      const seq = String(count + 1).padStart(3, '0');
      const newId = `UEM/${year}/${deptCode}/${seq}`;
      db.prepare('INSERT INTO users (id, name, email, phone, password, department, semester, program, admission_year) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)').run(newId, name, email, phone || null, hash(password), deptCode, program, year);
      return newId;
    })();
  } catch (e) {
    if (e.message?.includes('UNIQUE constraint')) return res.status(409).json({ error: 'Email already registered.' });
    throw e;
  }

  const token = crypto.randomUUID();
  db.prepare('INSERT INTO sessions (token, user_id, name, role) VALUES (?, ?, ?, ?)').run(token, id, name, 'student');

  res.json({ success: true, token, user: { id, name, department: deptCode, semester: 1 } });
});

api.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const user = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(username, username);
  if (!user || user.password !== hash(password)) return res.status(401).json({ error: 'Invalid credentials.' });

  const token = crypto.randomUUID();
  db.prepare('INSERT INTO sessions (token, user_id, name, role) VALUES (?, ?, ?, ?)').run(token, user.id, user.name, 'student');

  res.json({ success: true, token, user: { id: user.id, name: user.name, department: user.department, semester: user.semester, program: user.program } });
});

api.post('/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.json({ success: true });
});

// ── Student Portal ────────────────────────────────────────
api.get('/student/profile', authMiddleware, (req, res) => {
  const u = db.prepare('SELECT id, name, email, phone, department, semester, program, admission_year, dob, gender, blood_group, address, cgpa, backlogs FROM users WHERE id = ?').get(req.user.user_id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

api.get('/student/grades', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT semester, subject_code, subject_name, credits, grade FROM grades WHERE user_id = ? ORDER BY semester, subject_code').all(req.user.user_id);

  // Group by semester
  const semMap = {};
  for (const r of rows) {
    if (!semMap[r.semester]) semMap[r.semester] = [];
    semMap[r.semester].push({ code: r.subject_code, name: r.subject_name, credits: r.credits, grade: r.grade });
  }
  const semesters = Object.entries(semMap).map(([sem, subjects]) => {
    const totalCredits = subjects.reduce((a, s) => a + s.credits, 0);
    const totalPoints = subjects.reduce((a, s) => a + s.credits * (gradePoints[s.grade] || 0), 0);
    return { sem: Number(sem), subjects, semGpa: totalCredits ? Number((totalPoints / totalCredits).toFixed(2)) : 0 };
  });

  const allCredits = rows.reduce((a, r) => a + r.credits, 0);
  const allPoints = rows.reduce((a, r) => a + r.credits * (gradePoints[r.grade] || 0), 0);
  const cgpa = allCredits ? Number((allPoints / allCredits).toFixed(2)) : 0;
  const gradeDistribution = {};
  rows.forEach(r => { gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1; });

  res.json({ semesters, cgpa, totalCredits: allCredits, gradeDistribution });
});

api.get('/student/attendance', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT subject_code, subject_name, total, attended FROM attendance WHERE user_id = ?').all(req.user.user_id);
  const totalAll = rows.reduce((a, r) => a + r.total, 0);
  const attendedAll = rows.reduce((a, r) => a + r.attended, 0);
  const overall = totalAll ? Math.round((attendedAll / totalAll) * 100) : 0;
  const subjects = rows.map(r => ({ code: r.subject_code, name: r.subject_name, total: r.total, attended: r.attended }));
  res.json({ overall, subjects });
});

api.get('/student/fees', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT semester, amount, paid, status, date, due_date, receipt_no FROM fees WHERE user_id = ? ORDER BY semester').all(req.user.user_id);
  res.json(rows.map(r => ({
    sem: r.semester, amount: r.amount, paid: r.paid, status: r.status,
    date: r.date, dueDate: r.due_date, receiptNo: r.receipt_no,
  })));
});

api.get('/student/timetable', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT time_slot, day, subject, room, type FROM timetable WHERE user_id = ? ORDER BY time_slot, CASE day WHEN \'mon\' THEN 1 WHEN \'tue\' THEN 2 WHEN \'wed\' THEN 3 WHEN \'thu\' THEN 4 WHEN \'fri\' THEN 5 END').all(req.user.user_id);

  // Pivot to time-slot rows like the original format
  const slotMap = {};
  for (const r of rows) {
    if (!slotMap[r.time_slot]) slotMap[r.time_slot] = { time: r.time_slot };
    slotMap[r.time_slot][r.day] = r.subject ? { subject: r.subject, room: r.room, type: r.type } : null;
  }
  // Fill missing days with null
  const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const result = Object.values(slotMap).map(slot => {
    for (const d of days) { if (!(d in slot)) slot[d] = null; }
    return slot;
  });
  res.json(result);
});

api.get('/student/library', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT title, author, issued, due, status FROM library_books WHERE user_id = ?').all(req.user.user_id);
  res.json(rows);
});

api.get('/student/dashboard', authMiddleware, (req, res) => {
  const u = db.prepare('SELECT name, id, department, semester, program FROM users WHERE id = ?').get(req.user.user_id);
  if (!u) return res.status(404).json({ error: 'User not found' });

  const gradeRow = db.prepare('SELECT semester, subject_code, subject_name, credits, grade FROM grades WHERE user_id = ? ORDER BY semester DESC').all(req.user.user_id);
  const latestSem = gradeRow.length ? gradeRow[0].semester : 0;
  const latestSubjects = gradeRow.filter(r => r.semester === latestSem).map(r => ({ code: r.subject_code, name: r.subject_name, credits: r.credits, grade: r.grade }));
  const semCredits = latestSubjects.reduce((a, s) => a + s.credits, 0);
  const semPoints = latestSubjects.reduce((a, s) => a + s.credits * (gradePoints[s.grade] || 0), 0);
  const cgpa = semCredits ? Number((semPoints / semCredits).toFixed(2)) : 0;

  const att = db.prepare('SELECT total, attended FROM attendance WHERE user_id = ?').all(req.user.user_id);
  const attTotal = att.reduce((a, r) => a + r.total, 0);
  const attDone = att.reduce((a, r) => a + r.attended, 0);
  const attendance = attTotal ? Math.round((attDone / attTotal) * 100) : 0;

  const feeRows = db.prepare('SELECT amount, status, due_date FROM fees WHERE user_id = ?').all(req.user.user_id);
  const pendingFee = feeRows.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const nextDue = feeRows.find(f => f.status === 'pending')?.due_date || '';

  const libCount = db.prepare("SELECT COUNT(*) as c FROM library_books WHERE user_id = ? AND status = 'issued'").get(req.user.user_id);

  res.json({
    name: u.name, id: u.id, department: u.department, semester: u.semester, program: u.program,
    cgpa, attendance, pendingFee, nextDue,
    recentGrades: latestSubjects,
    booksIssued: libCount.c,
  });
});

app.use('/api', api);

// ── Serve Frontend ────────────────────────────────────────
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
