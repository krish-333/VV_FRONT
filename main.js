// =========================================================================
// VIVAH VERSE — SHARED FRONTEND UTILITIES
// =========================================================================

// ---- Mobile nav toggle ----
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Highlight active nav link ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // ---- Update nav auth state ----
  updateAuthNav();
});

// ---- Auth state helpers (token stored in localStorage) ----
function getToken() { return localStorage.getItem('vv_token'); }
function getUser() {
  const raw = localStorage.getItem('vv_user');
  return raw ? JSON.parse(raw) : null;
}
function setSession(token, user) {
  localStorage.setItem('vv_token', token);
  localStorage.setItem('vv_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('vv_token');
  localStorage.removeItem('vv_user');
}

// Where each role lands after login/signup.
function dashboardUrlForRole(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'vendor') return 'vendor-dashboard.html';
  return 'account.html';
}

/**
 * Call at the top of any page that requires a logged-in user.
 * allowedRoles: array of role strings, or omit/empty to allow any logged-in user.
 * Redirects to login.html (with a returnTo) if not authenticated,
 * or to the correct dashboard if authenticated with the wrong role.
 * Returns the user object if the check passes (for convenience).
 */
function requireAuth(allowedRoles = []) {
  const user = getUser();
  const token = getToken();
  if (!user || !token) {
    const here = window.location.pathname.split('/').pop();
    window.location.href = `login.html?returnTo=${encodeURIComponent(here)}`;
    return null;
  }
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    window.location.href = dashboardUrlForRole(user.role);
    return null;
  }
  return user;
}

function updateAuthNav() {
  const slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  const user = getUser();
  if (user) {
    slot.innerHTML = `
      <a href="${dashboardUrlForRole(user.role)}" class="btn btn-outline btn-sm">Hi, ${user.full_name.split(' ')[0]}</a>
      <button class="btn btn-primary btn-sm" onclick="handleLogout()">Log out</button>
    `;
  } else {
    slot.innerHTML = `
      <a href="login.html" class="btn btn-ghost">Log in</a>
      <a href="signup.html" class="btn btn-primary">Get Started</a>
    `;
  }
}

function handleLogout() {
  clearSession();
  window.location.href = 'index.html';
}

// ---- Simple form-field validation helper ----
function showFieldError(fieldId, message) {
  const errEl = document.getElementById(fieldId + '-error');
  if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
}
function clearFieldError(fieldId) {
  const errEl = document.getElementById(fieldId + '-error');
  if (errEl) { errEl.classList.remove('show'); }
}
function showBanner(bannerId, message, type = 'error') {
  const el = document.getElementById(bannerId);
  if (!el) return;
  el.textContent = message;
  el.className = `form-banner show ${type}`;
}

// ---- Small formatting helpers reused across dashboards ----
function formatINR(n) {
  if (n === null || n === undefined) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}
function formatDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function statusTagClass(status) {
  const map = {
    confirmed: 'verified', completed: 'verified',
    pending: '', declined: '', cancelled: ''
  };
  return map[status] !== undefined ? map[status] : '';
}
