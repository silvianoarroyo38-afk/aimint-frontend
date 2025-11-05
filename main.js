// Authentication State
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
  console.log('AIMint Authentication System Loaded!');
  
  // Check for existing session
  checkExistingAuth();
  
  // Setup authentication event listeners
  setupAuthHandlers();
});

// Check if user is already logged in
function checkExistingAuth() {
  const savedUser = localStorage.getItem('aimint_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForAuthState();
  }
}

// Setup all authentication button handlers
function setupAuthHandlers() {
  // Join Beta / Get Early Access buttons
  const authButtons = ['ctaJoin', 'joinBtn'];
  authButtons.forEach(btnId => {
    const button = document.getElementById(btnId);
    if (button) {
      button.addEventListener('click', handleAuthButtonClick);
    }
  });
  
  // Explore button
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      if (currentUser) {
        showNotification('Welcome back to Explore!', 'success');
      } else {
        showAuthModal('explore');
      }
    });
  }
}

// Handle authentication button clicks
function handleAuthButtonClick(event) {
  if (currentUser) {
    showNotification(`Welcome back, ${currentUser.name}!`, 'success');
  } else {
    showAuthModal('join');
  }
}

// Show authentication modal
function showAuthModal(context = 'join') {
  // Create modal HTML
  const modalHTML = `
    <div class="auth-modal-overlay" id="authModal">
      <div class="auth-modal">
        <div class="auth-header">
          <h3>Join AIMint Beta</h3>
          <button class="close-auth" onclick="closeAuthModal()">&times;</button>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Login</button>
          <button class="auth-tab" data-tab="register">Register</button>
        </div>
        <div class="auth-content">
          <form class="auth-form active" id="loginForm">
            <input type="email" placeholder="Email" required class="auth-input">
            <input type="password" placeholder="Password" required class="auth-input">
            <button type="submit" class="btn btn-primary auth-submit">Login</button>
          </form>
          <form class="auth-form" id="registerForm">
            <input type="text" placeholder="Full Name" required class="auth-input">
            <input type="email" placeholder="Email" required class="auth-input">
            <input type="password" placeholder="Password" required class="auth-input">
            <button type="submit" class="btn btn-primary auth-submit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Setup tab switching
  setupAuthTabs();
  
  // Setup form submissions
  setupAuthForms();
}

// Setup authentication tab switching
function setupAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show correct form
      document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
      });
      document.getElementById(`${targetTab}Form`).classList.add('active');
    });
  });
}

// Setup authentication form submissions
function setupAuthForms() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    handleLogin(email, password);
  });
  
  // Register form
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    handleRegister(name, email, password);
  });
}

// Handle user login
function handleLogin(email, password) {
  // Simulate API call - In production, this would connect to your backend
  setTimeout(() => {
    const user = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      joined: new Date().toISOString()
    };
    
    currentUser = user;
    localStorage.setItem('aimint_user', JSON.stringify(user));
    updateUIForAuthState();
    closeAuthModal();
    showNotification(`Welcome back, ${user.name}!`, 'success');
  }, 1000);
}

// Handle user registration
function handleRegister(name, email, password) {
  // Simulate API call
  setTimeout(() => {
    const user = {
      id: Date.now(),
      name: name,
      email: email,
      joined: new Date().toISOString()
    };
    
    currentUser = user;
    localStorage.setItem('aimint_user', JSON.stringify(user));
    updateUIForAuthState();
    closeAuthModal();
    showNotification(`Welcome to AIMint, ${name}!`, 'success');
  }, 1000);
}

// Update UI based on authentication state
function updateUIForAuthState() {
  const joinButtons = document.querySelectorAll('#ctaJoin, #joinBtn');
  const exploreBtn = document.getElementById('exploreBtn');
  
  if (currentUser) {
    // User is logged in
    joinButtons.forEach(btn => {
      btn.textContent = `Welcome, ${currentUser.name}`;
      btn.style.background = 'linear-gradient(135deg, #FF00FF 0%, #2D1B69 100%)';
    });
    
    if (exploreBtn) {
      exploreBtn.textContent = 'My Dashboard';
    }
  }
}

// Close authentication modal
function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.remove();
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #00D4FF 0%, #2D1B69 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 600;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('auth-modal-overlay')) {
    closeAuthModal();
  }
});
