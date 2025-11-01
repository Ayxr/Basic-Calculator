/*
  auth-navbar.js
  - Injects "Sign In" and "Sign Up" buttons next to the theme toggle in the navbar.
  - Buttons use Arial Black (ariblk / 'Arial Black') for font.
  - Client-side routing for /signin/ and /signup/ (trailing slashes).
  - Renders Sign In page (email/phone + password) and Sign Up page (email, password, confirm password + "Sign up with Google" button).
  - Hides element with id="calculatorContainer" (or the first .calculator-container) while on auth pages.
  - Front-end only (dummy) auth: stores currentUser in localStorage so sign-in persists across reloads.
  - Exposes global helpers: routeTo(path), logout(), authSocial(provider)
  - Intended to be included AFTER your navbar and calculator DOM exist (e.g., <script src="auth-navbar.js"></script> placed at end of body).
*/

(function () {
  'use strict';

  // Utilities
  function $(sel, root = document) { return root.querySelector(sel); }
  function create(tag, attrs = {}) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  // Use localStorage to persist "signed-in" user (frontend-only demo)
  const STORAGE_KEY = 'basiccalc_current_user';
  function loadUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  function saveUser(user) { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }
  function clearUser() { localStorage.removeItem(STORAGE_KEY); }

  // Find navbar
  const nav = $('nav.navbar') || document.querySelector('nav') || null;
  if (!nav) console.warn('auth-navbar.js: no <nav> element found (recommended: <nav class="navbar">). Script will still try to inject controls.');

  // Ensure calculator container can be hidden
  let calcRoot = document.getElementById('calculatorContainer');
  if (!calcRoot) {
    const found = document.querySelector('.calculator-container');
    if (found) {
      found.id = 'calculatorContainer';
      calcRoot = found;
    }
  }

  // Ensure authPage exists (where we'll render signin/signup forms)
  let authPage = document.getElementById('authPage');
  if (!authPage) {
    authPage = create('div', { id: 'authPage' });
    authPage.style.display = 'none';
    // insert after calculator if possible
    if (calcRoot && calcRoot.parentNode) calcRoot.parentNode.insertBefore(authPage, calcRoot.nextSibling);
    else document.body.appendChild(authPage);
  }

  // Find or create navbar-actions container (right side)
  let navbarActions = document.getElementById('navbarActions') || $('.navbar-actions');
  if (!navbarActions) {
    navbarActions = create('div', { id: 'navbarActions', class: 'navbar-actions' });
    // append to nav if available, else append to nav-like area or body
    if (nav) nav.appendChild(navbarActions);
    else document.body.appendChild(navbarActions);
  }

  // Ensure theme toggle exists and is at start of navbarActions (so auth buttons are to its right)
  let themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) {
    themeBtn = create('button', { id: 'themeToggleBtn', class: 'theme-toggle-btn', title: 'Toggle theme' });
    const icon = create('span', { id: 'themeIcon', text: '🌙' });
    themeBtn.appendChild(icon);
    navbarActions.appendChild(themeBtn);
  } else {
    // move into navbarActions left-most if not there
    if (!navbarActions.contains(themeBtn)) navbarActions.insertBefore(themeBtn, navbarActions.firstChild);
    if (!document.getElementById('themeIcon')) {
      const icon = create('span', { id: 'themeIcon', text: '🌙' });
      themeBtn.appendChild(icon);
    }
  }

  // Creates or ensures a button exists in navbarActions
  function ensureNavBtn(id, text, clickHandler) {
    let btn = document.getElementById(id);
    if (!btn) {
      btn = create('button', { id, class: 'navbar-btn', text });
      btn.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif"; // Arial Black
      btn.addEventListener('click', clickHandler);
      navbarActions.appendChild(btn);
    } else {
      btn.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif";
      btn.onclick = clickHandler;
      btn.style.display = ''; // ensure visible
    }
    return btn;
  }

  // Create Sign In / Sign Up / Log Out buttons
  const loginBtn = ensureNavBtn('signinBtn', 'Sign In', () => routeTo('/signin/'));
  const signupBtn = ensureNavBtn('signupBtn', 'Sign Up', () => routeTo('/signup/'));
  const logoutBtn = ensureNavBtn('logoutBtn', 'Log Out', logout);
  logoutBtn.style.display = 'none'; // hidden until signed in

  // Auth state
  let currentUser = loadUser();

  function updateNavbarAuthState() {
    if (currentUser) {
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      logoutBtn.style.display = '';
    } else {
      loginBtn.style.display = '';
      signupBtn.style.display = '';
      logoutBtn.style.display = 'none';
    }
  }

  function loginUser(user) {
    currentUser = user;
    saveUser(user);
    updateNavbarAuthState();
  }

  function logout() {
    currentUser = null;
    clearUser();
    updateNavbarAuthState();
    routeTo('/');
  }

  // Routing helpers: routes are /signin/ and /signup/ (trailing slash) per request
  function routeTo(path) {
    // If already at path, still render
    try {
      if (window.location.pathname !== path) window.history.pushState({}, '', path);
    } catch {
      // ignore pushState errors
    }
    renderPage();
  }
  window.addEventListener('popstate', renderPage);

  function renderPage() {
    const path = window.location.pathname;
    if (path === '/signin/') {
      if (calcRoot) calcRoot.style.display = 'none';
      authPage.style.display = '';
      renderSigninPage();
    } else if (path === '/signup/') {
      if (calcRoot) calcRoot.style.display = 'none';
      authPage.style.display = '';
      renderSignupPage();
    } else {
      if (calcRoot) calcRoot.style.display = '';
      authPage.style.display = 'none';
      authPage.innerHTML = '';
    }
    updateNavbarAuthState();
  }

  // Render Sign In page
  function renderSigninPage() {
    authPage.innerHTML = '';
    const card = create('div', { class: 'auth-page' });
    // Inline minimal styling so it looks okay with existing site; you can override in your CSS
    card.style.maxWidth = '360px';
    card.style.margin = '3rem auto';
    card.style.padding = '1.6rem';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)';
    card.style.background = getComputedStyle(document.body).backgroundColor === 'rgb(24, 26, 27)' ? '#232627' : '#fff';
    const title = create('h2', { text: 'Sign In' });
    title.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif";
    title.style.color = '#388e3c';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '1rem';

    const form = create('form', { class: 'auth-form', id: 'signinForm' });
    const email = create('input', { type: 'text', id: 'signinEmail', placeholder: 'Email or Phone', autocomplete: 'username' });
    const pass = create('input', { type: 'password', id: 'signinPassword', placeholder: 'Password', autocomplete: 'current-password' });
    [email, pass].forEach(i => {
      i.style.width = '100%';
      i.style.padding = '0.5rem';
      i.style.marginBottom = '0.6rem';
      i.style.borderRadius = '8px';
      i.style.border = '1px solid #ccc';
      i.style.boxSizing = 'border-box';
      i.style.fontSize = '1rem';
    });
    const err = create('div', { id: 'signinError', class: 'auth-error' });
    err.style.color = 'red';
    err.style.minHeight = '1.2rem';
    const submit = create('button', { type: 'submit', text: 'Sign In' });
    submit.style.width = '100%';
    submit.style.padding = '0.6rem';
    submit.style.borderRadius = '8px';
    submit.style.border = 'none';
    submit.style.background = '#4caf50';
    submit.style.color = '#fff';
    submit.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif';
    submit.style.cursor = 'pointer';

    form.appendChild(email);
    form.appendChild(pass);
    form.appendChild(err);
    form.appendChild(submit);

    const socialWrap = create('div', { class: 'auth-social' });
    ['Google', 'Facebook', 'Apple'].forEach(provider => {
      const b = create('button', { type: 'button', text: `Sign in with ${provider}` });
      b.style.width = '100%';
      b.style.padding = '0.55rem';
      b.style.borderRadius = '8px';
      b.style.border = '1px solid #ddd';
      b.style.marginTop = '0.45rem';
      b.style.cursor = 'pointer';
      b.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif";
      b.addEventListener('click', () => authSocial(provider));
      socialWrap.appendChild(b);
    });

    const switchLink = create('div', { class: 'auth-switch-link', text: "Don't have an account? Sign Up" });
    switchLink.style.textAlign = 'center';
    switchLink.style.marginTop = '0.8rem';
    switchLink.style.color = '#4caf50';
    switchLink.style.cursor = 'pointer';
    switchLink.addEventListener('click', () => routeTo('/signup/'));

    card.appendChild(title);
    card.appendChild(form);
    card.appendChild(socialWrap);
    card.appendChild(switchLink);
    authPage.appendChild(card);

    form.onsubmit = function (e) {
      e.preventDefault();
      const em = (email.value || '').trim();
      const pw = (pass.value || '').trim();
      if (!em || !pw) {
        err.textContent = 'Please enter both email (or phone) and password.';
        return;
      }
      // Dummy check: accept any credentials (in a real app replace with API call)
      loginUser({ email: em });
      routeTo('/');
    };
  }

  // Render Sign Up page
  function renderSignupPage() {
    authPage.innerHTML = '';
    const card = create('div', { class: 'auth-page' });
    card.style.maxWidth = '360px';
    card.style.margin = '3rem auto';
    card.style.padding = '1.6rem';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)';
    card.style.background = getComputedStyle(document.body).backgroundColor === 'rgb(24, 26, 27)' ? '#232627' : '#fff';

    const title = create('h2', { text: 'Sign Up' });
    title.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif";
    title.style.color = '#388e3c';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '1rem';

    const socialTop = create('div', { class: 'auth-social' });
    const googleBtn = create('button', { type: 'button', text: 'Sign up with Google' });
    googleBtn.style.width = '100%';
    googleBtn.style.padding = '0.6rem';
    googleBtn.style.borderRadius = '8px';
    googleBtn.style.border = '1px solid #ddd';
    googleBtn.style.cursor = 'pointer';
    googleBtn.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif";
    googleBtn.addEventListener('click', () => authSocial('Google'));
    socialTop.appendChild(googleBtn);

    const or = create('div', { text: '— or create an account —' });
    or.style.textAlign = 'center';
    or.style.margin = '0.8rem 0';
    or.style.color = '#666';

    const form = create('form', { class: 'auth-form', id: 'signupForm' });
    const email = create('input', { type: 'text', id: 'signupEmail', placeholder: 'Email or Phone', autocomplete: 'username' });
    const pass = create('input', { type: 'password', id: 'signupPassword', placeholder: 'Create Password', autocomplete: 'new-password' });
    const pass2 = create('input', { type: 'password', id: 'signupConfirm', placeholder: 'Confirm Password', autocomplete: 'new-password' });
    [email, pass, pass2].forEach(i => {
      i.style.width = '100%';
      i.style.padding = '0.5rem';
      i.style.marginBottom = '0.6rem';
      i.style.borderRadius = '8px';
      i.style.border = '1px solid #ccc';
      i.style.boxSizing = 'border-box';
      i.style.fontSize = '1rem';
    });
    const err = create('div', { id: 'signupError', class: 'auth-error' });
    err.style.color = 'red';
    err.style.minHeight = '1.2rem';
    const submit = create('button', { type: 'submit', text: 'Sign Up' });
    submit.style.width = '100%';
    submit.style.padding = '0.6rem';
    submit.style.borderRadius = '8px';
    submit.style.border = 'none';
    submit.style.background = '#4caf50';
    submit.style.color = '#fff';
    submit.style.fontFamily = "'Arial Black', ariblk, Arial, sans-serif';
    submit.style.cursor = 'pointer';

    form.appendChild(email);
    form.appendChild(pass);
    form.appendChild(pass2);
    form.appendChild(err);
    form.appendChild(submit);

    const switchLink = create('div', { class: 'auth-switch-link', text: 'Already have an account? Sign In' });
    switchLink.style.textAlign = 'center';
    switchLink.style.marginTop = '0.6rem';
    switchLink.style.color = '#4caf50';
    switchLink.style.cursor = 'pointer';
    switchLink.addEventListener('click', () => routeTo('/signin/'));

    card.appendChild(title);
    card.appendChild(socialTop);
    card.appendChild(or);
    card.appendChild(form);
    card.appendChild(switchLink);
    authPage.appendChild(card);

    form.onsubmit = function (e) {
      e.preventDefault();
      const em = (email.value || '').trim();
      const pw = (pass.value || '').trim();
      const pw2 = (pass2.value || '').trim();
      if (!em || !pw || !pw2) {
        err.textContent = 'Please fill out all fields.';
        return;
      }
      if (pw !== pw2) {
        err.textContent = 'Passwords do not match.';
        return;
      }
      // Dummy signup - would call a backend API in a real app
      loginUser({ email: em });
      routeTo('/');
    };
  }

  // Dummy social auth - in real app, redirect to OAuth flow
  function authSocial(provider) {
    loginUser({ email: provider + 'User' });
    routeTo('/');
  }

  // Expose helpers globally for other inline handlers if needed
  window.routeTo = routeTo;
  window.logout = logout;
  window.authSocial = authSocial;

  // Initial state
  updateNavbarAuthState();

  // Render current location if page loaded on /signin/ or /signup/
  document.addEventListener('DOMContentLoaded', renderPage);

  // Informational console output
  console.info('auth-navbar.js: Sign In / Sign Up controls injected. Paths: /signin/ and /signup/. Front-end only demo auth.');
})();
