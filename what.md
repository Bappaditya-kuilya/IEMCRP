# What.md — IEMCRP Full Status Report

## What Is This Project?

IEMCRP is a college ERP system for **Institute of Engineering & Management (IEM) / University of Engineering & Management (UEM)**, Kolkata. It's meant to replace or complement the existing ERP at iemcrp.com with a modern web interface.

---

## What Exists Today

### Backend (Java 21 + Spring Boot 3) — WORKING

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/auth/login` | ✅ Works | JWT auth, bcrypt passwords |
| `GET /api/student/dashboard` | ✅ Works | Returns student profile, latest result, attendance, notices |
| `GET /api/student/results` | ✅ Works | Exam results with marks, grades |
| `GET /api/student/attendance` | ✅ Works | Present/absent/late counts + records |
| `GET /api/student/gpa` | ✅ Works | Semester + cumulative GPA |
| `GET /api/student/enroll` | ✅ Works | Student's enrolled sections |
| `GET /api/students` | ✅ Works | Student list (for staff/admin) |
| `GET /api/staff/courses` | ✅ Works | Course catalog |
| `GET /api/staff/courses/:id/sections` | ✅ Works | Sections with instructor, capacity |
| `GET /api/admin/fees/structures` | ✅ Works | Fee structures |
| `GET /api/admin/reports/enrollment` | ✅ Works | Enrollment analytics |
| `GET /api/admin/reports/grades` | ✅ Works | Grade distribution |
| `GET /swagger-ui.html` | ✅ Works | API documentation |

### Frontend (React + TypeScript + Vite + Tailwind v4) — BROKEN DESIGN

| Page | Status | Problem |
|------|--------|---------|
| Login | ❌ | Generic SaaS look, not college-themed |
| Dashboard | ❌ | Shows wrong data, layout doesn't match IEM style |
| Results | ❌ | Table works but no real data from backend |
| Students | ❌ | Shows hardcoded/mock data |
| Attendance | ❌ | Shows mock data |
| Notices | ❌ | Shows mock data |
| Staff: Manage Results | ❌ | Mock data |
| Staff: Upload Results | ❌ | Form exists but no real exam data |
| Admin: Dashboard | ❌ | Mock stats |
| Admin: Users | ❌ | Mock data |
| Admin: Audit Log | ❌ | Mock data |

---

## What's Wrong With the Current Frontend

### 1. Design Doesn't Match IEM/UEM

IEM's actual websites (iem.edu.in, uem.edu.in) use:
- **White/light backgrounds** with blue (#1a56db) and gold accents
- **Clean, professional, institutional** look — not startup/SaaS
- **IEM logo** prominently displayed
- **Standard college ERP layout**: sidebar + header + content area
- **Simple, functional** UI — not glassmorphism, not gradient meshes
- **Mobile responsive** but desktop-first

What I built instead:
- Dark purple/indigo gradient mesh backgrounds
- Glassmorphism cards with backdrop blur
- Animated floating orbs
- Gradient buttons with glow effects
- Looks like a SaaS startup, not a college

### 2. Data Flow Is Broken

The frontend calls APIs but the responses don't match what the UI expects:

```
Frontend expects: { firstName, rollNumber, latestResult, attendance, notices }
Backend returns:  Different structure (need to verify exact shape)
```

### 3. Role-Based Navigation Is Wrong

The user said: *"why a student can check stuff and prof pages?"*

Current issue:
- Student sees Staff/Admin nav items in sidebar
- Route guards exist but sidebar shows all items regardless of role
- The `isStaffOrAdmin()` check in sidebar is correct but the UI still shows everything

### 4. No Real Data

Most pages show hardcoded/mock data because:
- Backend endpoints exist but frontend doesn't call them correctly
- No proper error handling when API returns empty
- No loading states that match the design

---

## What IEM/UEM Actually Looks Like

### iem.edu.in (Main Website)
- White background, blue header
- IEM logo top-left
- Navigation: About, Campus Life, Departments, R&D, Academics, Admissions
- Clean institutional design
- Hero sections with college photos
- News/events cards
- Rankings, testimonials, placement data

### iemcrp.com (Existing ERP)
- Standard college ERP login page
- Student/faculty/admin portals
- Dashboard with:
  - Student profile (name, roll, dept, semester)
  - Attendance summary
  - Recent results
  - Fee status
  - Notices/announcements
  - Course schedule

### admission.uem.edu.in (Student Login)
- Clean white login card
- Email field
- "Not registered?" link
- Simple, no-nonsense design

---

## What Needs to Happen

### Phase 1: Fix the Design (What I Should Have Done)

1. **Color scheme**: White background, blue (#1a56db) primary, gray sidebar
2. **Typography**: Clean sans-serif (Inter is fine, but no gradient text)
3. **Layout**: Standard sidebar + header + content (no glass effects)
4. **Logo**: IEM logo in sidebar header
5. **Remove**: All glassmorphism, gradient meshes, animated orbs, glow effects
6. **Cards**: Simple white cards with subtle border, no hover transforms
7. **Buttons**: Solid blue, no gradients, no shadows
8. **Tables**: Clean, minimal, functional
9. **Forms**: Standard inputs, no fancy styling

### Phase 2: Fix the Data Flow

1. Verify all API responses match frontend expectations
2. Add proper TypeScript interfaces for all API responses
3. Handle loading/error/empty states correctly
4. Wire up real data to all pages

### Phase 3: Fix Role-Based Access

1. Student: Dashboard, Results, Attendance, Notices, Enrollment
2. Staff: All student items + Manage Results, Upload Results, Create Exam
3. Admin: All staff items + Admin Dashboard, Users, Audit Log, Fees

### Phase 4: Match IEM ERP Features

Based on what iemcrp.com actually offers:

**Student Portal:**
- Profile (name, photo, roll, dept, semester, batch)
- Attendance (daily + summary)
- Results (semester-wise, CGPA)
- Course schedule (timetable)
- Fee status (paid/pending)
- Notices
- Library
- Hostel

**Faculty Portal:**
- Class roster
- Attendance marking
- Grade entry
- Course materials
- Student queries

**Admin Portal:**
- User management
- Course management
- Fee management
- Reports
- Audit log
- System settings

---

## What I Need to Do Next

1. **Strip the frontend** of all SaaS-style design
2. **Build a proper IEM-themed UI** based on their actual websites
3. **Fix all data connections** between frontend and backend
4. **Test every endpoint** with real data
5. **Deploy properly** so it's actually accessible

---

## Summary

| Area | Status | Priority |
|------|--------|----------|
| Backend API | ✅ Working | Done |
| Frontend Design | ❌ Wrong style | **HIGH** |
| Data Flow | ❌ Mock data everywhere | **HIGH** |
| Role Access | ❌ Students see admin pages | **HIGH** |
| Deployment | ❌ Containers work but not "live" | **MEDIUM** |
| IEM Branding | ❌ No logo, wrong colors | **HIGH** |

The frontend needs a complete redesign to match IEM/UEM's actual institutional style, not a SaaS startup look.
