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

function updateAuthNav() {
  const slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  const user = getUser();
  if (user) {
    slot.innerHTML = `
      <a href="account.html" class="btn btn-outline btn-sm">Hi, ${user.full_name.split(' ')[0]}</a>
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
