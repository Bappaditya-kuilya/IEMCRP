# IEMCRP Rebuild

Secure college ERP system — student results, attendance, notices, user management.

## Quick Start

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Staff | staff1 | password123 |
| Staff | staff2 | password123 |
| Student | student1 | password123 |
| Student | student2-5 | password123 |

## Tech Stack

- Java 21 + Spring Boot 3.4
- React + TypeScript + Tailwind CSS
- PostgreSQL 16 + Redis 7
- JWT auth (BCrypt) + Cloudflare Turnstile
- Docker Compose

## Features

**Students:** View results, attendance, notices

**Staff:** Upload results, create exams, manage student data

**Admin:** User management, audit logs, system overview

## Development

```bash
# Backend (requires Java 21)
cd backend && ./mvnw spring-boot:run

# Frontend (requires Node 22+)
cd frontend && npm install && npm run dev
```

## Stop

```bash
docker compose down
```

To also remove the database volume: `docker compose down -v`
