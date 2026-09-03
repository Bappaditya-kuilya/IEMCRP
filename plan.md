# IEMCRP Improvement Plan

Research-based roadmap from Harvard, MIT, Stanford, Ellucian Banner, and PeopleSoft Campus Solutions.

---

## Research Findings

### How Major Universities Build Their SIS

#### Harvard (my.harvard)
- **Stack:** Drupal (CMS), Salesforce (CRM), WordPress, Nginx, PHP
- **Architecture:** Enterprise Architecture layers — Security, UX, Applications, Middleware, Interoperation, Data, Infrastructure, Network, Physical
- **Key insight:** 77,723 course enrollments in fall semester startup. Peak demand handling is critical.
- **Auth:** HarvardKey (Okta-based SSO, passwordless)
- **Data:** Multi-school federated architecture with 1,529 subdomains

#### MIT (WebSIS)
- **Stack:** SAP (financials since 1997), custom WebSIS for student records
- **Architecture:** SAP Integration Broker for SOA, PeopleSoft-like patterns
- **Key insight:** Web-based SAP tool (SAPweb) for real-time purchase order visibility. Eliminated needless data re-entry.
- **Auth:** Touchstone (Shibboleth-based SSO)

#### Stanford (Axess/PeopleSoft)
- **Stack:** Oracle PeopleSoft Campus Solutions 9.2, Oracle Financials
- **Architecture:** PeopleSoft Internet Architecture (PIA) — Browser → Web Server → Application Server → Database
- **Key insight:** Spent $93.4M on ERP. 5-year timeline. "Just buying the software does not solve the problem."
- **Modules:** HRMS, Student Administration (Admissions, GFS, Student Financials, Records, Financial Aid), STARS (training)
- **Auth:** SUNet ID (CAS-based SSO)
- **Data warehouse:** SIRIS (Student Integrated Reporting and Information System) for analytics

#### Ellucian Banner (2,900+ institutions)
- **Modules:** Banner Student, Banner Finance, Banner HR, Banner Financial Aid, Intelligent Learning Platform
- **Architecture:** XE-powered common architecture across all modules. SaaS-first.
- **Key features:**
  - Self-service for students (enrollment, grades, schedules, billing, financial aid)
  - Faculty/advisor dashboards (course rosters, grades, advisee progress)
  - Process automation (no-code workflows)
  - Data orchestration (unified campus data integration)
  - Document management (secure collection, indexing, retention)
  - Reporting & analytics
- **Integration:** Ethos Integration platform, LMS sync, SSO, payment gateways

#### PeopleSoft Campus Solutions (Oracle)
- **Modules:**
  - Campus Community (people/org management, personal info)
  - Recruiting & Admissions
  - Student Records (catalog, schedule, enrollment, grading, transcripts, graduation)
  - Academic Advisement (degree audit, requirements tracking)
  - Financial Aid
  - Student Financials (billing, payments, collections)
  - Contributor Relations (alumni/donor management)
  - Campus Self Service
- **Architecture:** PeopleTools metadata-driven, Integration Broker (REST/SOAP), Fluid UI
- **Key patterns:**
  - Publish/subscribe for real-time events
  - Selective adoption via PUM (PeopleSoft Update Manager)
  - Role-based security with row-level access
  - Continuous delivery (no big-bang upgrades)

---

## What IEMCRP Is Missing (vs Production SIS)

### Critical Gaps

| Area | Current | Production Standard |
|------|---------|-------------------|
| **Course Management** | None | Full course catalog, scheduling, sections |
| **Enrollment** | None | Self-service registration, add/drop, waitlist |
| **Degree Audit** | None | Academic advisement, requirements tracking |
| **Fee Management** | None | Tuition calculation, billing, payment tracking |
| **Transcript** | None | Official/unofficial transcript generation |
| **Multi-tenant** | Basic (college_id) | Full tenant isolation with data partitioning |
| **Audit Trail** | Basic IP logging | Complete change tracking with before/after snapshots |
| **Notifications** | None | Email/SMS alerts for grades, deadlines, attendance |
| **Reporting** | Dashboard only | Custom report builder, export, scheduling |
| **API Documentation** | None | OpenAPI/Swagger specs |
| **Data Validation** | Minimal | Comprehensive input validation, business rules |

### Architecture Gaps

| Area | Current | Production Standard |
|------|---------|-------------------|
| **Event System** | None | Domain events for enrollment, grading, payments |
| **Caching Strategy** | Basic Redis | Multi-tier: session, query, result-day spike |
| **Background Jobs** | None | Async processing (grades, reports, notifications) |
| **File Storage** | None | Document management (transcripts, certificates) |
| **Message Queue** | None | RabbitMQ/Kafka for async operations |
| **API Versioning** | None | v1/v2 API versioning strategy |
| **Health Monitoring** | Basic /health | Deep health checks, metrics, distributed tracing |

---

## Implementation Roadmap

### Phase 1: Course & Enrollment System (Week 1-2)
- [ ] Course catalog (code, name, credits, prerequisites)
- [ ] Course sections (instructor, schedule, capacity, room)
- [ ] Student enrollment (register, drop, waitlist)
- [ ] Enrollment capacity management
- [ ] Prerequisite checking

### Phase 2: Academic Records (Week 3-4)
- [ ] Grade entry (staff → student mapping)
- [ ] GPA calculation (semester + cumulative)
- [ ] Transcript generation (official/unofficial)
- [ ] Academic standing (probation, suspension, dismissal)
- [ ] Degree audit (requirements vs completed courses)

### Phase 3: Fee Management (Week 5-6)
- [ ] Fee structure (tuition, hostel, lab, library)
- [ ] Invoice generation
- [ ] Payment tracking (partial, full, late)
- [ ] Receipt generation
- [ ] Outstanding balance reports

### Phase 4: Advanced Features (Week 7-8)
- [ ] Notification system (email/SMS for grades, deadlines)
- [ ] Report builder (custom queries, exports)
- [ ] Event sourcing (audit trail with snapshots)
- [ ] Background job processing (grade calculations, reports)
- [ ] API documentation (OpenAPI/Swagger)

---

## Technical Decisions

### Database Schema Additions
```sql
-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY,
    college_id UUID NOT NULL REFERENCES colleges(id),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    prerequisites JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Sections
CREATE TABLE course_sections (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id),
    college_id UUID NOT NULL REFERENCES colleges(id),
    instructor_id UUID REFERENCES users(id),
    semester INT NOT NULL,
    academic_year INT NOT NULL,
    schedule JSONB,
    room VARCHAR(50),
    max_capacity INT NOT NULL,
    current_enrollment INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id),
    section_id UUID NOT NULL REFERENCES course_sections(id),
    college_id UUID NOT NULL REFERENCES colleges(id),
    status VARCHAR(20) DEFAULT 'ENROLLED',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dropped_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(student_id, section_id)
);

-- Grades
CREATE TABLE grades (
    id UUID PRIMARY KEY,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    student_id UUID NOT NULL REFERENCES students(id),
    section_id UUID NOT NULL REFERENCES course_sections(id),
    college_id UUID NOT NULL REFERENCES colleges(id),
    grade VARCHAR(2),
    marks DECIMAL(5,2),
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee Structure
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY,
    college_id UUID NOT NULL REFERENCES colleges(id),
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    semester INT,
    academic_year INT,
    due_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
    college_id UUID NOT NULL REFERENCES colleges(id),
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    college_id UUID NOT NULL REFERENCES colleges(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints to Add

#### Course Management (Staff/Admin)
```
POST   /api/staff/courses              - Create course
GET    /api/staff/courses              - List courses
PUT    /api/staff/courses/{id}         - Update course
POST   /api/staff/courses/{id}/sections - Create section
GET    /api/staff/courses/{id}/sections - List sections
```

#### Enrollment (Student/Staff)
```
POST   /api/student/enroll/{sectionId}  - Enroll in section
DELETE /api/student/enroll/{sectionId}  - Drop section
GET    /api/student/enrollments         - List my enrollments
GET    /api/staff/sections/{id}/roster  - View section roster
```

#### Grades (Staff/Student)
```
POST   /api/staff/grades                - Submit grades (bulk)
GET    /api/student/grades              - View my grades
GET    /api/student/gpa                 - View GPA
GET    /api/student/transcript          - Generate transcript
```

#### Fees (Staff/Student)
```
POST   /api/admin/fees                  - Create fee structure
GET    /api/student/fees                - View my fees
GET    /api/student/invoices            - View my invoices
POST   /api/student/pay/{invoiceId}     - Record payment
```

#### Reports (Admin)
```
GET    /api/admin/reports/enrollment    - Enrollment report
GET    /api/admin/reports/grades        - Grade distribution
GET    /api/admin/reports/fees          - Fee collection
GET    /api/admin/reports/attendance    - Attendance summary
```

---

## Build Order (Loop Pattern)

Each loop = one file or small group, compile/test, commit.

1. Course entity + repository
2. CourseSection entity + repository
3. Enrollment entity + repository
4. Grade entity + repository
5. FeeStructure entity + repository
6. Invoice entity + repository
7. Payment entity + repository
8. CourseController (staff CRUD)
9. EnrollmentController (student self-service)
10. GradeController (staff submit, student view)
11. FeeController (admin CRUD, student view)
12. ReportController (admin analytics)
13. Schema.sql update
14. Seed.sql update (sample courses)
15. GPA calculation service
16. Transcript generation service
17. Notification service (email stubs)
18. Background job config (Spring @Async)
19. API documentation (SpringDoc OpenAPI)
20. Health check improvements
