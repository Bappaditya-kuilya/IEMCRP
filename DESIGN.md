# DESIGN.md — IEMCRP Rebuild

## 1. Design Direction

**Aesthetic:** Clean, institutional, trustworthy. Not a SaaS startup — this is a college system that handles real student data. The design should feel like software that takes its job seriously.

**Memorable thing:** "This just works." Students should feel confident their results are safe and accessible. Staff should feel efficient. Admin should feel in control.

**Departure from category norms:**
1. No purple gradients, no hero images, no decorative blobs — education software doesn't need to "delight," it needs to work
2. Data-forward: numbers and status visible at a glance, not buried in clicks

---

## 2. Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| Body | **Inter** | 400, 500, 600 | 14px–16px |
| Headings | **Inter** | 600, 700 | 20px–32px |
| Monospace (codes, IDs) | **JetBrains Mono** | 400 | 13px |

**Why Inter:** System font performance, excellent readability at small sizes, widely used in dashboards. No custom font loading delay.

---

## 3. Color System

### Light Mode (primary — students use this on mobile in bright classrooms)

```css
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;
--surface: #ffffff;
--border: #e2e8f0;
--border-strong: #cbd5e1;

--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;

--accent: #2563eb;        /* blue-600 — primary actions */
--accent-hover: #1d4ed8;
--accent-subtle: #eff6ff;

--success: #16a34a;       /* green — pass, active, online */
--warning: #d97706;       /* amber — pending, attention */
--danger: #dc2626;        /* red — fail, error, blocked */

--sidebar-bg: #0f172a;    /* slate-900 — dark sidebar */
--sidebar-text: #e2e8f0;
--sidebar-active: #2563eb;
```

### Dark Mode (staff/admin working late hours)

```css
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--bg-tertiary: #334155;
--surface: #1e293b;
--border: #334155;
--border-strong: #475569;

--text-primary: #f8fafc;
--text-secondary: #94a3b8;
--text-muted: #64748b;

--accent: #3b82f6;        /* blue-500 — brighter for dark bg */
--accent-hover: #60a5fa;
--accent-subtle: #1e3a5f;

--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;
```

---

## 4. Layout

### Sidebar + Content (admin/staff)

```
┌─────────────────────────────────────────────┐
│ [Logo]  College Name                    [⋮] │
├──────────┬──────────────────────────────────┤
│ Dashboard│  Welcome back, Dr. Sharma        │
│ Results  │                                  │
│ Students │  ┌──────┐ ┌──────┐ ┌──────┐     │
│ Attendance│ │ 1,247 │ │  98% │ │  12  │     │
│ Notices  │ │Total  │ │Pass  │ │New   │     │
│ Settings │ │Students│ │Rate  │ │Notices│     │
│          │ └──────┘ └──────┘ └──────┘     │
│          │                                  │
│          │  ┌─────────────────────────────┐ │
│          │  │  Recent Activity / Chart     │ │
│          │  │                              │ │
│          │  └─────────────────────────────┘ │
│          │                                  │
│          │  ┌─────────────────────────────┐ │
│          │  │  Data Table                  │ │
│          │  └─────────────────────────────┘ │
└──────────┴──────────────────────────────────┘
```

### Student Dashboard (mobile-first)

```
┌─────────────────────┐
│ ☰  IEMCRP      🔔  │
├─────────────────────┤
│ Hi, Priya           │
│ Roll: 2024CSE042    │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Latest Result   │ │
│ │ Semester 5      │ │
│ │ CGPA: 8.7       │ │
│ │ [View Details]  │ │
│ └─────────────────┘ │
├─────────────────────┤
│ ┌─────┐ ┌─────┐    │
│ │ 85% │ │ 12  │    │
│ │Attnd│ │Notice│   │
│ └─────┘ └─────┘    │
├─────────────────────┤
│ Recent Notices      │
│ • Exam schedule...  │
│ • Holiday declar... │
└─────────────────────┘
```

---

## 5. Components

### Cards
- Border: 1px solid `--border`
- Border-radius: 8px
- Padding: 16px–24px
- No shadows by default (add `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` on hover only)

### Buttons
| Type | Style |
|------|-------|
| Primary | `--accent` bg, white text, 8px radius |
| Secondary | transparent bg, `--accent` border + text |
| Danger | `--danger` bg, white text |
| Ghost | no bg/border, `--text-secondary` text |

Height: 36px (default), 40px (large). Padding: 0 16px.

### Tables
- Zebra striping: alternate rows `--bg-secondary`
- Sticky header on scroll
- Row hover: `--bg-tertiary`
- Responsive: horizontal scroll on mobile

### Forms
- Input height: 40px
- Border: 1px solid `--border`
- Focus: 2px solid `--accent`, 0 0 0 3px `--accent-subtle`
- Labels above inputs, 14px, `--text-secondary`
- Error state: border `--danger`, message below in `--danger`

### Status Badges
```css
.badge-pass     { background: #dcfce7; color: #166534; }
.badge-fail     { background: #fee2e2; color: #991b1b; }
.badge-pending  { background: #fef3c7; color: #92400e; }
.badge-active   { background: #dbeafe; color: #1e40af; }
```

---

## 6. Spacing & Grid

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Content max-width: 1280px
- Sidebar width: 240px (desktop), 0 (mobile, hamburger menu)
- Grid: 12-column, 16px gutters

---

## 7. Iconography

Use **Lucide React** (already popular in React ecosystem, MIT licensed, consistent style).

Key icons:
- Dashboard: `LayoutDashboard`
- Results: `FileText`
- Students: `Users`
- Attendance: `CalendarCheck`
- Notices: `Bell`
- Settings: `Settings`
- Logout: `LogOut`
- Search: `Search`

---

## 8. Animations

Minimal. This is institutional software.

- Page transitions: fade 150ms ease
- Dropdown/menu: slide down 100ms ease
- Toast notifications: slide in from top-right 200ms
- No parallax, no scroll animations, no decorative motion

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, hamburger nav, stacked cards |
| Tablet | 768px–1024px | 2-column grid, collapsible sidebar |
| Desktop | > 1024px | Full sidebar + content |

---

## 10. Accessibility (WCAG 2.2 AA)

- Color contrast: 4.5:1 minimum for text
- Focus indicators visible on all interactive elements
- All form inputs have associated labels
- Tables use proper `<th>` and `scope` attributes
- Error messages linked to inputs via `aria-describedby`
- Skip-to-content link
- Reduced motion: respect `prefers-reduced-motion`

---

## 11. Anti-Slop Checklist

Before shipping any UI:
- [ ] No purple gradients
- [ ] No decorative blobs or sparkles
- [ ] No "centered everything" — use left-aligned content
- [ ] No stock photos
- [ ] No emoji in UI elements
- [ ] No "Welcome to..." filler text
- [ ] No card with icon + title + description in a 3-column grid as homepage
- [ ] No fade-in-up animations on scroll

---

## 12. Component Library Strategy

**Base: shadcn/ui** — all modern React UI libraries (Skiper, SmoothUI, KokonutUI) build on shadcn patterns. We use shadcn/ui directly as our foundation.

| Layer | Choice | Why |
|-------|--------|-----|
| Components | **shadcn/ui** | Copy-paste, owned code, no black boxes |
| Styling | **Tailwind CSS v4** | Utility-first, consistent tokens, dark mode built-in |
| Animation | **Motion** (framer-motion) | Spring physics, reduced-motion aware, minimal use |
| Icons | **Lucide React** | MIT, consistent, 1000+ icons |

**What we take from each library:**

| Library | Relevant patterns | Ignore |
|---------|-------------------|--------|
| Skiper UI | Card hover states, reveal animations (sparingly) | Dynamic Island, cursor trails, drag-scroll |
| SmoothUI | Anti-slop quality gate approach, component composition | Number Flow, Scramble Hover, Siri Orb |
| KokonutUI | MCP integration for AI agents, component registry pattern | Particle buttons, liquid glass cards, shimmer text |
| SkeuDesign | N/A — skeuomorphic icons don't fit institutional UI | Entire library |
| Unlumen UI | N/A — too few components documented | Entire library |

**Key decision:** We do NOT use particle buttons, liquid glass, shimmer text, or dynamic islands. This is college software, not a portfolio site. Every component earns its place by solving a user problem.

---

## 13. Anti-Slop Checklist (v2 — from SmoothUI + zilch-slop)

Before shipping any UI:
- [ ] No purple gradients
- [ ] No decorative blobs or sparkles
- [ ] No "centered everything" — use left-aligned content
- [ ] No stock photos
- [ ] No emoji in UI elements
- [ ] No "Welcome to..." filler text
- [ ] No card with icon + title + description in a 3-column grid as homepage
- [ ] No fade-in-up animations on scroll
- [ ] No particle effects
- [ ] No liquid glass / glassmorphism
- [ ] No shimmer/gradient text
- [ ] No components that exist only to look cool

**Quality gate:** If a component doesn't help a student check their result, a staff member upload grades, or an admin manage users — it doesn't ship.

---

## 14. Design References Used

| Source | What we took |
|--------|--------------|
| CollectUI | Card-based dashboard patterns, data visualization layouts |
| Seesaw | Clean typography, minimal aesthetic |
| Recent.design | Modern dashboard UI patterns |
| Dribbble (education dashboards) | Role-based layouts, student portal patterns |
| Muzli (dashboard inspiration) | Data density, KPI card patterns |
| AdminLTE/blog | Dashboard template best practices |
| FUSELAB (dashboard trends 2026) | Context-aware design, cognitive load reduction |
| Skiper UI | Card hover states, shadcn component patterns |
| SmoothUI | Anti-slop detection philosophy, Motion animation approach |
| KokonutUI | Component registry pattern, AI-agent integration |
| SkeuDesign | Rejected — skeuomorphic style doesn't fit |
| Unlumen UI | Rejected — insufficient documentation |

---

*Last updated: 2026-09-02*
