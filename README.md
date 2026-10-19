# CodeReview AI — Intern-Level Automated Project Review System

An automated, AST-powered code evaluation and compliance platform designed for universities, coding bootcamps, and software engineering internships. CodeReview AI bridges the gap between student code submissions, curriculum rubric compliance, and mentor evaluation.

---

## 🌟 Key Features & Delivered Frontend Architecture

The platform comprises 10 core views and components built with the custom **Precision Slate** design system (`assets/css/main.css`):

| Page | File | Description & Capabilities |
|:---|:---|:---|
| **Authentication & Registration** | `login.html` | Dual-mode Sign-In and self-service Create Account tabs with role selector (`Student`, `Mentor`, `Administrator`). |
| **System Dashboard** | `index.html` | Role-aware KPI summary cards, active submission queues, and recent code review feeds. |
| **Project Submission Intake** | `project_create.html` | Multi-step submission wizard: ZIP upload with live validation, SRS document matching, rubric selection, and AST pre-checks. |
| **Project Directory** | `project_list.html` | Filterable project catalog with status badges, score indicators, search, and pagination. |
| **Project Details & AST Manifest** | `project_detail.html` | Requirement traceability matrix, file manifest tree inspector, iteration history log, and mentor notes. |
| **Code Findings & AST Inspector** | `findings.html` | Master-detail diagnostic code viewer, line-by-line unified diff inspector, AI-suggested AST fixes, and faculty grade overrides. |
| **Executive Audit Report** | `report.html` | Printable executive review report with radar chart analytics, category breakdowns, remediation roadmap, and verifiable certification watermark. |
| **Audit Log & History** | `history.html` | Chronological audit trail of all code evaluations, status changes, mentor sign-offs, and CSV export. |
| **Administration Console** | `admin_users.html` | User directory management, role promotion/demotion, account activation/deactivation, and system-wide policy boundary tuning. |

---

## 👥 Role-Based Access Control (RBAC)

The frontend features dynamic client-side role enforcement via `localStorage` and `sessionStorage`:

- **Student / Intern:**
  - Submit projects via `project_create.html`.
  - View own project details, code findings, and executive reports.
  - Read-only access to mentor sign-off forms with locked indicators.
  - Guarded against accessing administrative pages (`admin_users.html`).
- **Mentor / Faculty:**
  - Review student submissions across all cohorts.
  - Inspect AST code diffs and accept/reject suggested AI patches.
  - Execute mentor score overrides, write feedback notes, and sign off on reports.
  - Export audit logs to CSV.
- **Administrator:**
  - Full system access across all views.
  - Manage user accounts, promote/demote roles, and activate/deactivate users.
  - Configure system thresholds (Max ZIP size, SRS file limits, AST extraction timeouts, passing score thresholds).

---

## 🛠️ Technical Stack & Standards

- **Core:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS.
- **Styling & UI:** Precision Slate custom design tokens (`assets/css/main.css`), Bootstrap 5.3.3 utilities, Bootstrap Icons 1.11.3.
- **Accessibility:** Normalized WCAG AAA contrast across dark and light surfaces, keyboard-navigable interactive controls, semantic HTML structure.
- **Charts:** Chart.js 4.4.1 for radar and compliance metrics.

---

## 📚 Technical Documentation & Logs

1. **[System Workflow & User Credentials Guide](SYSTEM_WORKFLOW_AND_CREDENTIALS.md):**
   - Detailed user workflows for Student, Mentor, and Administrator personas.
   - Self-service account onboarding and password recovery procedures.
   - Deterministic AST analysis engine specifications.
2. **[Testing & Technical Audit Report](TESTING_AND_TECHNICAL_AUDIT.md):**
   - End-to-end multi-role testing logs and edge-case discoveries.
   - Functional resolution log for all 5 audit issues.
   - WCAG AAA contrast remediation changelog across 7 modified templates.
   - Verification recordings and screenshot references.

---

## 📜 Session Status & Commit History

- **Branch:** `feature/frontend-ui`
- **Status:** All 10 phases completed, multi-role audited, contrast-verified, and ready for Pull Request merge into `main`.
