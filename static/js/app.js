/**
 * CodeReview AI — Global Application Script
 * Handles navigation interactions, sidebar collapse, mobile drawer, CSRF handling, and role simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initMobileDrawer();
  initRoleSimulator();
  initAutoDismissAlerts();
});

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
 * 4. Role Simulator (For Frontend Preview & Testing)
 * Allows developers and mentors to preview views as Mentor, Student, or Admin.
 */
function initRoleSimulator() {
  const roleSelect = document.getElementById('devRoleSelector');
  if (!roleSelect) return;

  // Read stored preview role or default to 'mentor'
  const currentRole = localStorage.getItem('cr_dev_role') || 'mentor';
  roleSelect.value = currentRole;
  applyRoleVisibility(currentRole);

  roleSelect.addEventListener('change', (e) => {
    const selectedRole = e.target.value;
    localStorage.setItem('cr_dev_role', selectedRole);
    applyRoleVisibility(selectedRole);
  });
}

function applyRoleVisibility(role) {
  // Update role badges in UI
  document.querySelectorAll('[data-role-badge]').forEach(badge => {
    badge.className = `cr-role-badge ${role}`;
    const icon = role === 'mentor' ? 'bi-mortarboard-fill' : (role === 'admin' ? 'bi-shield-lock-fill' : 'bi-person-fill');
    badge.innerHTML = `<i class="bi ${icon}"></i> ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  });

  // Admin-only nav items
  document.querySelectorAll('[data-role-perm="admin-only"]').forEach(el => {
    el.style.display = (role === 'admin') ? '' : 'none';
  });

  // Mentor-only actions
  document.querySelectorAll('[data-role-perm="mentor-only"]').forEach(el => {
    el.style.display = (role === 'mentor' || role === 'admin') ? '' : 'none';
  });

  // Student-restricted notices
  document.querySelectorAll('[data-role-perm="student-only"]').forEach(el => {
    el.style.display = (role === 'student') ? '' : 'none';
  });
}

/**
 * 5. Auto-dismiss alerts after 6 seconds
 */
function initAutoDismissAlerts() {
  document.querySelectorAll('.cr-alert.auto-dismiss').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 400);
    }, 6000);
  });
}
