// AIMint Authentication System - Bulletproof Version
console.log('🚀 AIMint Platform Loading...');

let currentUser = null;

// Simple Authentication Functions
function showAuthModal() {
    console.log('🔐 Opening auth modal...');
    
    const modalHTML = `
        <div class="auth-modal-overlay" id="authModal">
            <div class="auth-modal">
                <div class="auth-header">
                    <h3>Join AIMint Beta</h3>
                    <button class="close-auth" onclick="closeAuthModal()">&times;</button>
                </div>
                <input type="email" placeholder="Your Email" class="auth-input" id="authEmail">
                <input type="password" placeholder="Create Password" class="auth-input" id="authPassword">
                <button class="btn btn-primary auth-submit" onclick="handleAuthSubmit()">Get Early Access</button>
                <button class="btn btn-ghost auth-submit" onclick="closeAuthModal()">Maybe Later</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleAuthSubmit() {
    const email = document.getElementById('authEmail')?.value;
    const password = document.getElementById('authPassword')?.value;
    
    if (email && password) {
        // Simulate user creation
        currentUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            joined: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('aimint_user', JSON.stringify(currentUser));
        
        showNotification(`🎉 Welcome to AIMint, ${currentUser.name}!`);
        closeAuthModal();
        updateUIForUser();
        
    } else {
        showNotification('Please enter both email and password');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.remove();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateUIForUser() {
    if (currentUser) {
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(btn => {
            btn.textContent = `Welcome, ${currentUser.name}`;
            btn.style.background = 'linear-gradient(135deg, #FF00FF 0%, #2D1B69 100%)';
        });
        
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.textContent = 'My Dashboard';
        }
    }
}

// Check for existing user on load
function checkExistingUser() {
    const savedUser = localStorage.getItem('aimint_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
        console.log('👤 User found:', currentUser.name);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AIMint loaded successfully!');
    
    // Check for existing user
    checkExistingUser();
    
    // Setup event listeners
    const authButtons = ['ctaJoin', 'joinBtn'];
    authButtons.forEach(btnId => {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', showAuthModal);
        }
    });
    
    // Explore button
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            if (currentUser) {
                showNotification('🚀 Opening your dashboard...');
            } else {
                showNotification('Explore amazing AI creations!');
            }
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('auth-modal-overlay')) {
            closeAuthModal();
        }
    });
    
    console.log('✅ All systems ready!');
});

// Global functions for HTML onclick
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
