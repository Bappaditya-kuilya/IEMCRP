import { programs, stats, notices, events, faculty, placements, academicCalendar, research, campus, users } from './data.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace('/api', '');
  const degree = url.searchParams.get('degree');
  const dept = url.searchParams.get('department');

  if (path === '/health') return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  if (path === '/stats') return res.json(stats);
  if (path === '/programs') {
    let r = programs;
    if (degree) r = r.filter(p => p.degree === degree);
    return res.json(r);
  }
  if (path === '/notices') return res.json(notices);
  if (path === '/events') return res.json(events);
  if (path === '/faculty') {
    let r = faculty;
    if (dept) r = r.filter(f => f.department === dept);
    return res.json(r);
  }
  if (path === '/placements') return res.json(placements);
  if (path === '/calendar') return res.json(academicCalendar);
  if (path === '/research') return res.json(research);
  if (path === '/campus') return res.json(campus);

  if (path === '/auth/login' && req.method === 'POST') {
    const { email, password } = req.body || {};
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const { password: _, ...safe } = user;
    return res.json({ token: 'mock-jwt-token-' + user.id, user: safe });
  }

  if (path === '/auth/register' && req.method === 'POST') {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const exists = users.find(u => u.email === email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const newUser = { id: users.length + 1, email, password, name, roll: 'NEW-' + Date.now(), department: 'TBD', semester: 1, cgpa: 0 };
    users.push(newUser);
    const { password: _, ...safe } = newUser;
    return res.json({ token: 'mock-jwt-token-' + newUser.id, user: safe });
  }

  if (path === '/sessions') return res.json([
    { id: 1, name: 'Fall 2026', startDate: '2026-08-01', endDate: '2026-12-10', status: 'active' },
    { id: 2, name: 'Spring 2027', startDate: '2027-01-10', endDate: '2027-05-15', status: 'upcoming' },
  ]);

  if (path === '/students/portal') return res.json({
    name: 'Rahul Sharma', roll: 'UEM-2023-CSE-001', department: 'CSE', semester: 5, cgpa: 8.7,
    courses: ['Data Structures', 'Operating Systems', 'Computer Networks', 'Database Management', 'Theory of Computation'],
    attendance: { total: 120, attended: 112, percentage: 93.3 },
    fees: { total: 120000, paid: 90000, pending: 30000, dueDate: '2026-09-30' },
    results: [
      { semester: 4, sgpa: 8.9, courses: [{ name: 'Algorithms', grade: 'A' }, { name: 'Software Engineering', grade: 'A+' }] },
      { semester: 3, sgpa: 8.5, courses: [{ name: 'Discrete Math', grade: 'A' }, { name: 'Digital Logic', grade: 'B+' }] },
    ],
  });

  res.status(404).json({ error: 'Not found' });
}
