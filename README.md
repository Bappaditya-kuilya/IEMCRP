# UEMCRP - University of Engineering & Management CRP

A full-stack university management portal cloned from UNT's website design, rebuilt with UEM (University of Engineering & Management, Kolkata) branding, data, and functionality.

## Tech Stack

- **Frontend**: Self-contained HTML/CSS/JavaScript (no framework)
- **Backend**: Node.js + Express.js
- **Database**: In-memory synthetic data (no external DB required)
- **Deployment**: Docker (single container)

## Features

### Public Pages
- Home (hero, stats, programs, events, why UEM)
- Academic Programs (filterable by degree)
- Notices & Announcements
- Events
- Placements (stats, top recruiters)
- About UEM
- Contact (form with backend submission)
- Faculty Directory (filterable by department)
- Academic Calendar
- Research & Publications
- Campus Info & Facilities
- Privacy Policy

### Student Portal
- Login / Registration with token-based auth
- Dashboard (CGPA, attendance, fees overview)
- Profile (full student details)
- Grades (semester-wise with SGPA/CGPA)
- Attendance (per-subject with progress bars)
- Fees (payment history, pending amounts)
- Timetable (weekly class schedule)
- Library (issued books, due dates)

## Quick Start

```bash
# Docker
docker build -t uem-site .
docker run -p 3000:4000 uem-site
```

## Demo Credentials

- **Student ID**: `UEM/2023/CSE/401`
- **Password**: `uem123`

## License

MIT
