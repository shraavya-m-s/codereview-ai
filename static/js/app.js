/**
 * CodeReview AI — Global Application Script
 * Handles navigation interactions, sidebar collapse, mobile drawer, CSRF handling, and role simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalTheme();
  checkAuthSession();
  initSidebar();
  initMobileDrawer();
  initUserSessionProfile();
  initAutoDismissAlerts();
  initSignOutButtons();
});

function initGlobalTheme() {
  const savedTheme = localStorage.getItem('cr_theme');
  if (!savedTheme || savedTheme === 'oxford-navy') {
    localStorage.setItem('cr_theme', 'precision-slate');
  }
  const theme = localStorage.getItem('cr_theme') || 'precision-slate';
  document.documentElement.setAttribute('data-theme', theme);
  // Expose global helper for testing if ever needed
  window.crSetTheme = setGlobalTheme;
}

function setGlobalTheme(theme) {
  localStorage.setItem('cr_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function initSignOutButtons() {
  document.querySelectorAll('a[href="login.html"], a[href="login.html?logout=true"]').forEach(btn => {
    btn.addEventListener('click', handleSignOut);
  });
}

/**
 * 0. Authentication Session Gate
 * If the user is on a protected page and not logged in, redirect to login.html.
 */
function checkAuthSession() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'login.html') {
    return; // Public login page
  }

  const isAuth = sessionStorage.getItem('cr_logged_in');
  if (!isAuth) {
    window.location.href = 'login.html';
    return;
  }

  // Role-based route guard: admin_users.html requires admin role
  const userRole = (sessionStorage.getItem('cr_user_role') || 'mentor').toLowerCase();
  if (currentPage === 'admin_users.html' && userRole !== 'admin') {
    window.location.href = 'index.html?error=unauthorized';
    return;
  }

  // Display unauthorized alert if redirected
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('error') === 'unauthorized') {
    const unauthEl = document.getElementById('unauthorizedAlert');
    if (unauthEl) unauthEl.classList.remove('d-none');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * Global Sign Out Helper
 */
function handleSignOut(e) {
  if (e) e.preventDefault();
  sessionStorage.removeItem('cr_logged_in');
  sessionStorage.removeItem('cr_auth_user');
  sessionStorage.removeItem('cr_user_role');
  sessionStorage.removeItem('cr_user_fullname');
  sessionStorage.removeItem('cr_user_email');
  window.location.href = 'login.html?logout=true';
}

/**
 * 1. Desktop Sidebar Collapse / Expand
 */
function initSidebar() {
  const sidebar = document.getElementById('crSidebar');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  if (!sidebar || !toggleBtn) return;

  // Retrieve saved preference if available
  const isCollapsed = localStorage.getItem('cr_sidebar_collapsed') === 'true';
  if (isCollapsed && window.innerWidth >= 992) {
    sidebar.classList.add('is-collapsed');
    updateToggleIcon(toggleBtn, true);
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('is-collapsed');
    const collapsed = sidebar.classList.contains('is-collapsed');
    localStorage.setItem('cr_sidebar_collapsed', collapsed);
    updateToggleIcon(toggleBtn, collapsed);
  });
}

function updateToggleIcon(btn, isCollapsed) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  if (isCollapsed) {
    icon.className = 'bi bi-layout-sidebar-inset';
    btn.setAttribute('title', 'Expand Sidebar');
  } else {
    icon.className = 'bi bi-layout-sidebar-inset-reverse';
    btn.setAttribute('title', 'Collapse Sidebar');
  }
}

/**
 * 2. Mobile Responsive Drawer & Backdrop
 */
function initMobileDrawer() {
  const sidebar = document.getElementById('crSidebar');
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const backdrop = document.getElementById('crMobileBackdrop');
  if (!sidebar || !mobileToggle) return;

  function openMobileMenu() {
    sidebar.classList.add('show-mobile');
    if (backdrop) backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    sidebar.classList.remove('show-mobile');
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('show-mobile')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('show-mobile')) {
      closeMobileMenu();
    }
  });

  // Reset drawer state on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && sidebar.classList.contains('show-mobile')) {
      closeMobileMenu();
    }
  });
}

/**
 * 3. Django CSRF Token Utility
 * Standard Django helper for fetch() requests.
 */
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === ('csrftoken=')) {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * 4. User Session & Role Permissions
 * Enforces authenticated role permissions from the session (set upon login).
 * Updates user profile name, handle, avatar, role badges, and visibility gates.
 */
function initUserSessionProfile() {
  const currentRole = sessionStorage.getItem('cr_user_role') || 'mentor';
  applyRoleVisibility(currentRole);
}

function applyRoleVisibility(role) {
  const customName = sessionStorage.getItem('cr_user_fullname');
  const customEmail = sessionStorage.getItem('cr_user_email');
  const customHandle = sessionStorage.getItem('cr_auth_user');

  const profileMap = {
    mentor: {
      name: customName || 'Dr. Aris (Mentor)',
      handle: customHandle || 'dr_aris',
      avatar: customName ? customName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'DA',
      email: customEmail || 'aris.mentor@university.edu',
      roleLabel: 'Mentor',
      icon: 'bi-mortarboard-fill'
    },
    student: {
      name: customName || 'Rahul Sharma (Intern)',
      handle: customHandle || 'rahul_s',
      avatar: customName ? customName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'RS',
      email: customEmail || 'rahul.intern@university.edu',
      roleLabel: 'Student',
      icon: 'bi-person-fill'
    },
    admin: {
      name: customName || 'System Admin',
      handle: customHandle || 'admin',
      avatar: customName ? customName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'AD',
      email: customEmail || 'admin@codereview.ai',
      roleLabel: 'Admin',
      icon: 'bi-shield-lock-fill'
    }
  };

  const profile = profileMap[role] || profileMap.mentor;

  // Set global auth role attribute for declarative CSS selectors
  document.documentElement.setAttribute('data-auth-role', role);

  // 1. Update role badges in UI
  document.querySelectorAll('[data-role-badge]').forEach(badge => {
    badge.className = `cr-role-badge ${role}`;
    badge.innerHTML = `<i class="bi ${profile.icon}"></i> ${profile.roleLabel}`;
  });

  // 2. Synchronize user profile display in sidebar & topbar
  document.querySelectorAll('.cr-user-name').forEach(el => { el.textContent = profile.name; });
  document.querySelectorAll('.cr-user-handle').forEach(el => { el.textContent = profile.handle; });
  document.querySelectorAll('.cr-user-avatar, .cr-user-avatar-sm').forEach(el => { el.textContent = profile.avatar; });
  document.querySelectorAll('.cr-user-fullname').forEach(el => { el.textContent = profile.name; });
  document.querySelectorAll('.cr-user-email').forEach(el => { el.textContent = profile.email; });

  // 3. Admin-only nav items & actions
  document.querySelectorAll('[data-role-perm="admin-only"]').forEach(el => {
    if (role === 'admin') {
      el.style.removeProperty('display');
    } else {
      el.style.setProperty('display', 'none', 'important');
    }
  });

  // 4. Mentor-only actions (Mentors and Admins have access)
  document.querySelectorAll('[data-role-perm="mentor-only"]').forEach(el => {
    if (role === 'mentor' || role === 'admin') {
      el.style.removeProperty('display');
    } else {
      el.style.setProperty('display', 'none', 'important');
    }
  });

  // 5. Student-restricted notices & views
  document.querySelectorAll('[data-role-perm="student-only"]').forEach(el => {
    if (role === 'student') {
      el.style.removeProperty('display');
    } else {
      el.style.setProperty('display', 'none', 'important');
    }
  });
}

/**
 * 5. Global Toast Notification System with Animated Progress Bar
 * Displays modern floating toast with right-to-left progress bar and auto-vanish in 4.5 seconds.
 */
function showToast(message, iconClass = 'bi-check-circle-fill text-success', type = 'success', duration = 4000) {
  let container = document.querySelector('.cr-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'cr-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'cr-toast';

  const typeMap = {
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    primary: 'info'
  };
  const progType = typeMap[type] || 'info';

  toast.innerHTML = `
    <div class="cr-toast-body">
      <i class="bi ${iconClass}"></i>
      <div class="flex-grow-1">${message}</div>
      <button type="button" class="cr-toast-close" aria-label="Close">
        <i class="bi bi-x-lg" style="font-size: 0.75rem;"></i>
      </button>
    </div>
    <div class="cr-toast-progress ${progType}" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.cr-toast-close');
  let dismissTimeout = null;

  function dismiss() {
    if (dismissTimeout) clearTimeout(dismissTimeout);
    toast.classList.add('is-hiding');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 350);
  }

  closeBtn.addEventListener('click', dismiss);
  dismissTimeout = setTimeout(dismiss, duration);
}

// Expose globally
window.showToast = showToast;

/**
 * 6. Alert Auto-Dismiss with Animated Countdown Timer
 */
function initAutoDismissAlerts() {
  document.querySelectorAll('.cr-alert.auto-dismiss').forEach(alert => {
    // Inject progress bar if not already present
    if (!alert.querySelector('.cr-alert-timer')) {
      const timer = document.createElement('div');
      timer.className = 'cr-alert-timer';
      alert.appendChild(timer);
    }
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 400);
    }, 4500);
  });
}

/**
 * 7. Unified Project Registry (localStorage)
 */
const DEFAULT_PROJECTS = [
  {
    name: 'Hospital_Management_System',
    student: 'Rahul Sharma',
    cohort: 'Batch 2026-Q1 (Fullstack)',
    stack: 'Python 3.12 / Django',
    date: '2026-10-18',
    status: 'completed',
    statusLabel: 'Completed',
    score: 86,
    rubric: 'security',
    desc: 'Automated hospital admission, appointment scheduler, and patient billings with RBAC.'
  },
  {
    name: 'ECommerce_Microservices_API',
    student: 'Neha Deshmukh',
    cohort: 'Batch 2026-Q1 (Backend)',
    stack: 'Python 3.12 / Django REST',
    date: '2026-10-17',
    status: 'manual_review',
    statusLabel: 'Manual Review',
    score: 78,
    rubric: 'standard',
    desc: 'Distributed Django REST Framework backend for cart checkout and JWT auth.'
  },
  {
    name: 'FinTech_Ledger_Service',
    student: 'Aman Verma',
    cohort: 'Batch 2026-Q2 (Cloud)',
    stack: 'Java 21 / Spring Boot',
    date: '2026-10-16',
    status: 'completed',
    statusLabel: 'Completed',
    score: 94,
    rubric: 'production',
    desc: 'High-throughput Spring Boot ledger service with double-entry accounting.'
  },
  {
    name: 'Smart_Campus_IoT_Hub',
    student: 'Pooja Nair',
    cohort: 'Batch 2026-Q1',
    stack: 'Node.js / Express',
    date: '2026-10-15',
    status: 'completed',
    statusLabel: 'Completed',
    score: 91,
    rubric: 'standard',
    desc: 'Campus sensor aggregation portal with MQTT ingestion and real-time dashboard.'
  },
  {
    name: 'Autonomous_Vehicle_Telemetry_API',
    student: 'Devashish Das',
    cohort: 'Batch 2026-Q2',
    stack: 'FastAPI / PostgreSQL',
    date: '2026-10-14',
    status: 'manual_review',
    statusLabel: 'Manual Review',
    score: 74,
    rubric: 'security',
    desc: 'High-frequency telemetry stream ingestion with geofencing.'
  },
  {
    name: 'Payment_Gateway_Mock_Service',
    student: 'Sneha Kulkarni',
    cohort: 'Batch 2026-Q1',
    stack: 'Flask / Celery',
    date: '2026-10-13',
    status: 'completed',
    statusLabel: 'Completed',
    score: 88,
    rubric: 'standard',
    desc: 'Idempotent card tokenization and webhook payment simulator.'
  }
];

function getStoredProjects() {
  const custom = JSON.parse(localStorage.getItem('cr_projects_custom') || '[]');
  const deleted = JSON.parse(localStorage.getItem('cr_deleted_projects') || '[]');
  
  // Combine custom projects first, then default projects that haven't been deleted
  const combined = [...custom];
  DEFAULT_PROJECTS.forEach(defProj => {
    if (!deleted.includes(defProj.name) && !combined.some(p => p.name === defProj.name)) {
      combined.push(defProj);
    }
  });

  return combined.filter(p => !deleted.includes(p.name));
}

function addProjectToStorage(proj) {
  const custom = JSON.parse(localStorage.getItem('cr_projects_custom') || '[]');
  custom.unshift(proj);
  localStorage.setItem('cr_projects_custom', JSON.stringify(custom));
}

function deleteProjectFromStorage(projName) {
  const deleted = JSON.parse(localStorage.getItem('cr_deleted_projects') || '[]');
  if (!deleted.includes(projName)) {
    deleted.push(projName);
    localStorage.setItem('cr_deleted_projects', JSON.stringify(deleted));
  }

  // Remove from custom if present
  let custom = JSON.parse(localStorage.getItem('cr_projects_custom') || '[]');
  custom = custom.filter(p => p.name !== projName);
  localStorage.setItem('cr_projects_custom', JSON.stringify(custom));
}

// Expose storage helpers globally
window.getStoredProjects = getStoredProjects;
window.addProjectToStorage = addProjectToStorage;
window.deleteProjectFromStorage = deleteProjectFromStorage;
