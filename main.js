// Simple Authentication System - Bulletproof Version
console.log('🔐 AIMint Auth System Loading...');

function showSimpleAuth() {
    console.log('Auth button clicked');
    
    // Create simple modal HTML
    const modalHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 4, 28, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div style="
                background: #0A041C;
                border: 2px solid #00D4FF;
                border-radius: 15px;
                padding: 30px;
                width: 90%;
                max-width: 400px;
                color: white;
            ">
                <h3 style="margin-bottom: 20px; font-family: 'Orbitron';">Join AIMint Beta</h3>
                <input type="email" placeholder="Your Email" id="authEmail" style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    background: rgba(10, 4, 28, 0.9);
                    border: 1px solid #00D4FF;
                    border-radius: 5px;
                    color: white;
                ">
                <button onclick="handleAuthSubmit()" style="
                    width: 100%;
                    padding: 12px;
                    background: #00D4FF;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Get Early Access</button>
                <button onclick="closeAuth()" style="
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    color: #00D4FF;
                    border: 1px solid #00D4FF;
                    border-radius: 5px;
                    margin-top: 10px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleAuthSubmit() {
    const emailInput = document.getElementById('authEmail');
    if (emailInput && emailInput.value) {
        alert('🎉 Welcome to AIMint! We\'ll contact you at: ' + emailInput.value);
        closeAuth();
    } else {
        alert('Please enter your email address');
    }
}

function closeAuth() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
}

// Safe event listeners - only run after page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AIMint loaded successfully!');
    
    // Add click handlers safely
    setTimeout(function() {
        const joinButtons = document.querySelectorAll('.btn-primary');
        joinButtons.forEach(button => {
            button.onclick = showSimpleAuth;
        });
        
        const exploreBtn = document.querySelector('.btn-ghost');
        if (exploreBtn) {
            exploreBtn.onclick = function() {
                alert('🚀 Explore feature coming soon!');
            };
        }
        
        console.log('✅ All event handlers attached safely!');
    }, 100);
});
