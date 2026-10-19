# CodeReview AI — System Workflows & Credentials Guide

**System Name:** CodeReview AI (Intern Project Automated Review & Verification System)  
**Version:** 1.2.0  
**Branch:** `feature/frontend-ui`  
**Target:** `main`

---

## 1. User Onboarding & Access Control

CodeReview AI uses institutional session-based authentication with self-service account registration and role-based permissions:

### 1.1 Self-Service Account Creation (Sign Up)
New users are directed to click the **"Create Account"** tab on `login.html` to register their institutional profile:
- **Full Name:** Institutional identification (e.g., `Neha Deshmukh`, `Dr. Vikramaditya`).
- **Username:** Unique alphanumeric handle (e.g., `neha_d`, `dr_vikram`). Reserved handles (`admin`, `root`, `sysadmin`) are protected against public self-registration.
- **Institutional Email:** University or organizational email address.
- **Role Tier:** Choose between:
  - **Student / Intern:** Enables project intake submission (100MB ZIP / 25MB SRS / Git), AST re-audit triggers, code findings inspection, and student scorecard viewing.
  - **Mentor / Reviewer:** Enables review queue oversight, AST diff inspection, automated patch acceptance, score overrides, and report accreditation sign-off.
- **Password:** Minimum 6-character secure credential with real-time confirmation validation.
- **Academic Honor Code:** Mandatory agreement to deterministic evaluation rules.

### 1.2 Administrative Accounts & Governance
Administrative privileges (System Admin) are strictly provisioned by existing administrators through the **User & System Admin Console (`admin_users.html`)** or backend provisioning. Public self-registration as an administrator is restricted to prevent unauthorized privilege escalation.

---

## 2. End-to-End User Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COUNCILS & WORKFLOW PHASES                      │
└────────────────────────────────────────────────────────────────────────┘

  [STUDENT WORKFLOW]
  1. Sign In (Student Persona)
        │
        ▼
  2. Workspace Dashboard (index.html)
        │
        ▼
  3. Upload Project (project_create.html)
     ├─ Choose Local Archive (100MB ZIP / 25MB SRS) OR Remote Git Clone
     ├─ Select Rubric (Standard, Strict Security, or Production Readiness)
     └─ Trigger 5-Stage Animated AST Intake Pipeline
        │
        ▼
  4. Project Detail Hub (project_detail.html)
     ├─ Inspect 4 KPI Metrics & AST Syntax Tree Manifest
     └─ Check SRS Traceability Matrix (Functional & Security Clauses)
        │
        ▼
  5. Findings Inspector (findings.html) [Read-Only Faculty Card]
     ├─ Inspect Rule Violations & Remediation Advice
     └─ Click "Accept Fix" to Apply Code Patch
        │
        ▼
  6. Final Executive Report (report.html)
     └─ Review Weighted Scores & Export JSON Dossier

──────────────────────────────────────────────────────────────────────────

  [MENTOR WORKFLOW]
  1. Sign In (Mentor Persona)
        │
        ▼
  2. Review Projects Queue (project_list.html)
     └─ Filter by Cohort / "Needs Review" / "Failed"
        │
        ▼
  3. Findings Workbench (findings.html)
     ├─ Filter findings by Category (Security, SRS, Quality, Perf)
     ├─ Side-by-side AST Code Diff Viewer (Red deletions / Green additions)
     ├─ Select Evaluated Status (Implemented 1.0, Partial 0.5, Missing 0.0)
     └─ Enter Mentor Evaluation Feedback & Submit Formal Sign-Off
        │
        ▼
  4. Review History & Audit Log (history.html)
     ├─ Open Revision Diff Modal (Compare Rev 2.1 vs Rev 2.0)
     └─ Export Audit Log to CSV

──────────────────────────────────────────────────────────────────────────

  [ADMINISTRATOR WORKFLOW]
  1. Sign In (Admin Persona)
        │
        ▼
  2. Administration Console (admin_users.html)
     ├─ [Tab 1: User Directory]
     │   ├─ Filter users by role (Mentor, Student, Admin)
     │   ├─ Register new users via "Add New User" modal
     │   ├─ Modify user roles with real-time DOM table updates
     │   └─ Deactivate / Reactivate user accounts with immediate feedback
     │
     └─ [Tab 2: Audit Engine & Policy Settings]
         ├─ Configure Passing Compliance Threshold (50% - 90%)
         ├─ Configure Distinction Threshold (80% - 98%)
         ├─ Set Max Source ZIP Limit (Clamped between 10 MB - 250 MB)
         ├─ Set Max SRS Document Limit (Clamped between 5 MB - 50 MB)
         ├─ Set AST Extraction Timeout (Clamped between 5s - 120s)
         └─ Toggle Mandatory Rule Checkers (OWASP, Secrets, Test Suites)
```

---

## 3. Technical Specifications & Analysis Engine

### 3.1 Deterministic AST Code Parser
- **Static Inspection Guarantee:** Student source code is parsed exclusively as Abstract Syntax Trees (AST). Code is never executed, preventing malicious script execution on host infrastructure.
- **Rules Audited:**
  1. `SEC-SQLI-01`: Raw string formatting in ORM queries (`.extra(where=...)`).
  2. `SEC-SECRET-01`: Plaintext production secrets / API keys in settings.
  3. `REQ-AUTH-01`: Bcrypt password hashing vs. plaintext credential checks.
  4. `REQ-PERF-01`: N+1 query detection and `select_related`/`prefetch_related` enforcement.
  5. `DOC-COV-01`: Public module, class, and method PEP-257 docstring coverage.

### 3.2 Weighted Evaluation Scoring Model
The system computes an overall weighted grade based on four key pillars:
$$\text{Overall Score} = (0.60 \times S_{\text{SRS}}) + (0.20 \times S_{\text{Quality}}) + (0.10 \times S_{\text{Tests}}) + (0.10 \times S_{\text{Docstrings}})$$

- **SRS Specification Compliance (60%):** Evaluates implementation of functional requirements.
- **Code Quality & Security (20%):** Deductions for OWASP vulnerabilities and code smells.
- **Automated Test Coverage (10%):** Verification of unit test suites (`pytest`/`unittest`).
- **Docstring & Standard Compliance (10%):** Adherence to PEP-8 and documentation standards.

---

## 4. Security & Access Control Summary

1. **Session Gate (`checkAuthSession`):** Protects all application screens. Unauthenticated requests automatically redirect to `login.html`.
2. **Role Gate (`admin_users.html`):** Strict verification ensures only accounts with `role === 'admin'` can access user management or engine policies. Any unauthorized attempt redirects to `index.html?error=unauthorized` and triggers an alert.
3. **Faculty Lock on Findings (`findings.html`):** Students are locked in a read-only mode for faculty evaluations, preventing tampering with review scores.
4. **Input Sanitization:** Search bars, user creation, and configuration fields are strictly sanitized and boundary-clamped to prevent injection and out-of-range configurations.
