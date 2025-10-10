// AUTH, ROUTING, AND NAVBAR LOGIC FOR LOGIN/SIGNUP PAGES

// --- THEME TOGGLE LOGIC ---
const themeButton = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const darkClass = 'dark';
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add(darkClass);
    themeIcon.textContent = '🌞';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove(darkClass);
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}
(function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
  } else {
    setTheme(false);
  }
})();
themeButton.addEventListener('click', () => {
  const isDark = !document.body.classList.contains(darkClass);
  setTheme(isDark);
});

// --- AUTH LOGIC ---
let currentUser = null;
function showNavbarAuth() {
  document.getElementById('loginBtn').style.display = currentUser ? 'none' : '';
  document.getElementById('signupBtn').style.display = currentUser ? 'none' : '';
  document.getElementById('logoutBtn').style.display = currentUser ? '' : 'none';
}
function logout() {
  currentUser = null;
  showNavbarAuth();
  routeTo('/');
}

// --- ROUTING ---
function routeTo(path) {
  window.history.pushState({}, '', path);
  renderPage();
}
window.addEventListener('popstate', renderPage);

function renderPage() {
  const path = window.location.pathname;
  const calculator = document.getElementById('calculatorContainer');
  const authPage = document.getElementById('authPage');
  if (path === '/login') {
    calculator.style.display = 'none';
    authPage.style.display = '';
    renderLoginPage();
  } else if (path === '/signup') {
    calculator.style.display = 'none';
    authPage.style.display = '';
    renderSignupPage();
  } else {
    calculator.style.display = '';
    authPage.style.display = 'none';
  }
  showNavbarAuth();
}
document.addEventListener('DOMContentLoaded', renderPage);

// --- LOGIN PAGE ---
function renderLoginPage() {
  const authPage = document.getElementById('authPage');
  authPage.innerHTML = `
    <div class="auth-page">
      <h2>Sign In</h2>
      <form class="auth-form" id="loginForm">
        <input type="text" id="loginEmail" placeholder="Email or Phone" autocomplete="username">
        <input type="password" id="loginPassword" placeholder="Password" autocomplete="current-password">
        <div class="auth-error" id="loginError"></div>
        <button type="submit">Sign In</button>
      </form>
      <div class="auth-social">
        <button onclick="authSocial('Google')">Sign in with Google</button>
        <button onclick="authSocial('Facebook')">Sign in with Facebook</button>
        <button onclick="authSocial('Apple')">Sign in with Apple</button>
      </div>
      <div class="auth-switch-link" onclick="routeTo('/signup')">Don't have an account? Sign Up</div>
    </div>
  `;
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    // Dummy auth: accepts any non-empty email/password
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) {
      document.getElementById('loginError').textContent = 'Please enter both email (or phone) and password.';
      return;
    }
    currentUser = { email };
    routeTo('/');
  };
}

// --- SIGNUP PAGE ---
function renderSignupPage() {
  const authPage = document.getElementById('authPage');
  authPage.innerHTML = `
    <div class="auth-page">
      <h2>Sign Up</h2>
      <form class="auth-form" id="signupForm">
        <input type="text" id="signupEmail" placeholder="Email or Phone" autocomplete="username">
        <input type="password" id="signupPassword" placeholder="Password" autocomplete="new-password">
        <div class="auth-error" id="signupError"></div>
        <button type="submit">Sign Up</button>
      </form>
      <div class="auth-social">
        <button onclick="authSocial('Google')">Sign up with Google</button>
        <button onclick="authSocial('Facebook')">Sign up with Facebook</button>
        <button onclick="authSocial('Apple')">Sign up with Apple</button>
      </div>
      <div class="auth-switch-link" onclick="routeTo('/login')">Already have an account? Sign In</div>
    </div>
  `;
  document.getElementById('signupForm').onsubmit = function(e) {
    e.preventDefault();
    // Dummy signup: accepts any non-empty email/password
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    if (!email || !password) {
      document.getElementById('signupError').textContent = 'Please enter both email (or phone) and password.';
      return;
    }
    currentUser = { email };
    routeTo('/');
  };
}

// --- SOCIAL AUTH (dummy, just logs in) ---
function authSocial(provider) {
  currentUser = { email: provider + 'User' };
  routeTo('/');
}
