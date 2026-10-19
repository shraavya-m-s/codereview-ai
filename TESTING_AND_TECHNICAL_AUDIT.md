# CodeReview AI — Comprehensive Technical Documentation & Multi-Role Audit

**Document Version:** 1.0.0  
**Repository:** `codereview-ai`  
**Branch:** `feature/frontend-ui`  
**Target:** `main`  
**Audit Scope:** Multi-Role User Persona Testing (Student, Mentor, Admin), End-to-End Edge Cases, Architecture & Verification Matrix.

---

## 1. Executive Project Summary

**CodeReview AI** is an automated intern code evaluation and compliance platform designed for universities, bootcamps, and software engineering internships. It bridges the gap between student source code and technical specifications by using deterministic Python Abstract Syntax Tree (AST) static analysis, rule-based security auditing (OWASP Top 10), docstring coverage analysis, and SRS (Software Requirements Specification) traceability.

---

## 2. Technical Architecture & Tech Stack

### 2.1 Core Technologies
- **Markup & Templates:** Semantic HTML5, Django Template Language syntax (`templates/base.html`, includes).
- **Styling Architecture:** Pure Vanilla CSS with the custom **Precision Slate** design token system (`static/css/main.css`, `static/css/components.css`, `static/css/dropzone.css`, `static/css/print.css`). No third-party Tailwind dependencies.
- **Client Logic & State:** Modern ES6+ JavaScript (`static/js/app.js`), `sessionStorage` for active session persistence, `localStorage` for UI preference state (sidebar collapse state, theme).
- **Framework Support:** Bootstrap 5.3.3 (grid and modal utilities) + Bootstrap Icons 1.11.3.
- **Backend Readiness:** Django ORM models, CSRF token helper (`getCSRFToken()`), and route endpoints structured for seamless Python/Django template rendering.

### 2.2 System Modules & Screen Inventory
1. **`login.html` (Authentication & Persona Gate):** 100vh split-screen authentication with interactive quick-switch persona tiles for Student, Mentor, and Administrator.
2. **`index.html` (Executive Workspace Dashboard):** Role-tailored KPI cards, active evaluation queue, rapid actions, and audit status pills.
3. **`project_list.html` (Projects Catalog Hub):** Multi-cohort filtering, live search with instant debounced filtering, multi-criteria sorting (Score, Date, Status), and status badges.
4. **`project_create.html` (Project Intake & Upload):** Dual ingestion modes (Local Archive: 100MB ZIP / 25MB SRS; Remote Git: repository clone tester), demo preset loaders, and 5-stage animated intake verification pipeline.
5. **`project_detail.html` (Project Detail & AST Re-Audit Hub):** Context ingestion, KPI metric tiles, category-filtered SRS traceability matrix (Functional, Security, Non-Functional), AST File Manifest inspector modal, and animated re-audit engine.
6. **`findings.html` (AI Findings Workbench & Inspector):** Master-detail workbench, line-by-line AST diff viewer (red/green additions/deletions), one-click "Accept Fix" automated patch, and mentor sign-off override form.
7. **`report.html` (Executive Audit & Accreditation Report):** Weighted multi-factor scoring model (Compliance 60%, Code Quality 20%, Unit Tests 10%, Docstrings 10%), ink-friendly print stylesheet (`static/css/print.css`), and JSON dossier export.
8. **`history.html` (Audit Trail & Version Evolution):** Historical review timeline, delta score badges (+14%), Revision Comparison Diff Modal (Rev 2.1 vs Rev 2.0), and CSV audit log export.
9. **`admin_users.html` (Administration & Governance Console):** User directory with role filtering, Add User modal, Edit User modal, role-based route guards, and audit engine policy controls.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Route / Component | Student (`student`) | Mentor (`mentor`) | Administrator (`admin`) |
|:---|:---:|:---:|:---:|
| **`login.html`** | Public Access | Public Access | Public Access |
| **`index.html`** | Student Dashboard | Mentor Review Queue | System Overview |
| **`project_list.html`** | View Catalog | View & Filter All | View & Filter All |
| **`project_create.html`** | Upload & Intake | Upload & Intake | Full Access |
| **`project_detail.html`** | View Status & AST | Re-Audit & Inspect | Re-Audit & Inspect |
| **`findings.html`** | View Code Findings | Override & Sign-off | Override & Sign-off |
| **`report.html`** | View & Export Report | Full Grading & Export | Full Grading & Export |
| **`history.html`** | View Revision Timeline | View & Export CSV | Full Audit Access |
| **`admin_users.html`** | **Blocked (Redirect)** | **Blocked (Redirect)** | **Full Management** |

---

## 4. Rigorous Multi-Role Edge-Case Testing Log

### 4.1 Persona 1: Student (Rahul Sharma / `rahul_intern`)
- **Login Flow:** Verified quick-login via Student persona. Session properly initialized with role `student`.
- **UI State:** Topbar and sidebar dynamically updated to "Rahul Sharma (Intern)" with `Student` badge.
- **Route Guard Test (PASS):** Directly navigated to `file:///.../admin_users.html`. `checkAuthSession()` intercepted the request, aborted execution, and redirected to `index.html?error=unauthorized` while displaying an unauthorized access alert.
- **Search Sanitization Test (PASS):** Injected `<script>alert(1)</script>` into search box in `project_list.html`. Safely treated as text literal with zero XSS execution.
- **Blank Intake Submission Test (PASS):** Clicked "Start Project Intake & Audit" without filling fields in `project_create.html`. Form submission was blocked with a validation toast warning.
- **Role Permission Gap Discovered (ISSUE #1):** On `findings.html`, the "Mentor Sign-off & Status Override" form is visible to students, allowing students to submit overrides.

---

### 4.2 Persona 2: Mentor (Dr. Aris / `aris_mentor`)
- **Login Flow:** Verified quick-login via Mentor persona. Session updated with `Mentor` role badge.
- **Route Guard Test (PASS):** Navigated directly to `admin_users.html`. Route guard redirected with unauthorized error banner.
- **SRS Traceability Filtering (PASS):** Switched category tabs on `project_detail.html` between Functional, Security, and All Categories.
- **AST File Tree Modal (PASS):** Clicked "Explore AST Syntax Tree". Modal rendered AST directory hierarchy with syntax highlight tags.
- **AST Re-Audit Engine (PASS):** Clicked "Re-Audit Project". Progress bar simulated multi-stage re-analysis and updated score badge from 84% to 92%.
- **Findings Master-Detail Workbench (PASS):** Filtered findings by Security, SRS Spec, Quality, Performance. Clicked "Accept Fix" on finding SEC-SQLI-01; verified status badge transitioned to "Resolved / Implemented".
- **Mentor Sign-off Submission (PASS):** Entered custom evaluation note, selected "Implemented (1.0)", and clicked "Save Finding Evaluation". Toast notification triggered and save timestamp updated.
- **Revision Diff Modal (PASS):** Opened `history.html`, triggered "Compare Revisions", and verified AST diff between Rev 2.1 and Rev 2.0.
- **Export Actions (PASS):** Triggered JSON export in `report.html` and CSV export in `history.html`.

---

### 4.3 Persona 3: Administrator (System Admin / `admin`)
- **Login Flow:** Logged in as Admin. Sidebar displayed the "Administration" section with the "User & System Admin" link.
- **User Directory Filtering (PASS):** Filtered by Mentor, Student, Admin, and All Roles.
- **User Search (PASS):** Searched for "neha" and "aman". Table rows filtered in real time.
- **Add User Modal (PASS):** Created new user account (`Kavita Iyer`, `@kavita_lead`, `kavita@university.edu`, role `Mentor`). New row dynamically appended to table.
- **Edit User Role Modal (ISSUE #2):** Edited user role via modal. Modal dismissed and toast displayed, but the table row DOM role badge was not updated.
- **Audit Policy Sliders (PASS):** Adjusted Passing Compliance slider from 70% to 85% and saved configuration.
- **Sign Out & Unauthenticated Route Guard (PASS):** Logged out to `login.html?logout=true`. Attempted to access `index.html` directly; access gate redirected immediately back to `login.html`.

---

## 5. Discovered Issues & Edge Cases for User Review

Below is the structured list of all edge cases and functional bugs discovered during the rigorous multi-role audit:

### Issue #1: Student Access to Mentor Override Form on `findings.html`
- **Severity:** High (Permission & RBAC Integrity)
- **Current Behavior:** When a Student accesses `findings.html`, the "Mentor Sign-off & Status Override" card is fully interactive, allowing students to override review scores and write mentor notes.
- **Recommended Fix:** Add `data-role-perm="mentor-only"` or render a read-only badge container (`"Evaluated by Mentor: Implemented (1.0)"`) when `role === 'student'`, disabling form inputs and hiding the save button.

### Issue #2: Edit User Role Does Not Mutate Table DOM in `admin_users.html`
- **Severity:** Medium (UI Consistency)
- **Current Behavior:** In `admin_users.html`, `saveEditedUser(e)` closes the modal and shows a toast, but does not update the table row's `data-role` attribute or role badge text in the DOM.
- **Recommended Fix:** Store a reference to the active target row in `editUserRole()`, and in `saveEditedUser()`, dynamically update the row's `data-role` attribute and inner HTML for the role badge.

### Issue #3: Missing Deactivate / Delete Action in `admin_users.html`
- **Severity:** Low (Feature Completeness)
- **Current Behavior:** The user directory only provides an "Edit" button. There is no option for administrators to deactivate or delete a user account.
- **Recommended Fix:** Add a secondary action dropdown or "Deactivate" button in the action column that removes or flags the user row as `Inactive`.

### Issue #4: Sidebar Link "Upload Project" Hidden for Students
- **Severity:** Medium (UX Workflow)
- **Current Behavior:** The `project_create.html` link in `templates/base.html` and other pages has `data-role-perm="mentor-only"`, hiding the upload link when a student logs in.
- **Recommended Fix:** Allow students to see "Upload Project" or designate whether interns should submit projects directly or if only mentors create them.

### Issue #5: Policy Input Range Validation in `admin_users.html`
- **Severity:** Low (Input Sanitization)
- **Current Behavior:** If an administrator types a negative number (e.g. `-10`) or values exceeding limits into the numeric inputs in `admin_users.html`, the form submits without frontend clamping.
- **Recommended Fix:** Add JavaScript validation clamping in `saveSystemConfig()` to ensure values remain within safe bounds.

---

## 6. Verification Artifacts
- **E2E Full Flow Video:** `e2e_full_flow_1792395316549.webp`
- **Rigorous Role Testing Video:** `rigorous_role_testing_1792396716883.webp`
- **Screenshots:**
  - `student_unauthorized_redirect.png`
  - `login_page_personas.png`
  - `executive_evaluation_report.png`
  - `user_management_panel.png`
  - `review_audit_trail_history.png`
