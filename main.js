// Authentication state
let currentUser = null;
let authToken = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  loadVideoGallery();
});

// Check if user has existing session
function checkAuthStatus() {
  const savedToken = localStorage.getItem('aimint_token');
  const savedUser = localStorage.getItem('aimint_user');
  
  if (savedToken && savedUser) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  } else {
    showAuthModal(); // Show login/register modal
  }
}

// Show authentication modal
function showAuthModal() {
  const modalHTML = `
    <div class="auth-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 4, 28, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    ">
      <div class="auth-card" style="
        background: rgba(10, 4, 28, 0.9);
        border: 2px solid #00D4FF;
        border-radius: 20px;
        padding: 40px;
        max-width: 400px;
        width: 90%;
        text-align: center;
      ">
        <h2 style="margin-bottom: 10px; color: #E8E8E8;">Welcome to AIMint</h2>
        <p class="muted" style="margin-bottom: 30px;">The future of AI video creation</p>
        
        <div id="loginForm">
          <h3 style="margin-bottom: 20px; color: #00D4FF;">Login</h3>
          <input type="email" id="loginEmail" placeholder="Your email" style="width: 100%; padding: 12px; margin-bottom: 15px; background: rgba(10, 4, 28, 0.8); border: 1px solid #00D4FF; border-radius: 8px; color: #E8E8E8;">
          <input type="password" id="loginPassword" placeholder="Your password" style="width: 100%; padding: 12px; margin-bottom: 20px; background: rgba(10, 4, 28, 0.8); border: 1px solid #00D4FF; border-radius: 8px; color: #E8E8E8;">
          <button onclick="login()" class="btn btn-primary" style="width: 100%; margin-bottom: 15px;">Login</button>
          <button onclick="showRegisterForm()" class="btn btn-ghost" style="width: 100%;">Create Account</button>
        </div>
        
        <div id="registerForm" style="display: none;">
          <h3 style="margin-bottom: 20px; color: #FF00FF;">Join AIMint</h3>
          <input type="text" id="registerName" placeholder="Your name" style="width: 100%; padding: 12px; margin-bottom: 15px; background: rgba(10, 4, 28, 0.8); border: 1px solid #FF00FF; border-radius: 8px; color: #E8E8E8;">
          <input type="email" id="registerEmail" placeholder="Your email" style="width: 100%; padding: 12px; margin-bottom: 15px; background: rgba(10, 4, 28, 0.8); border: 1px solid #FF00FF; border-radius: 8px; color: #E8E8E8;">
          <input type="password" id="registerPassword" placeholder="Create password" style="width: 100%; padding: 12px; margin-bottom: 20px; background: rgba(10, 4, 28, 0.8); border: 1px solid #FF00FF; border-radius: 8px; color: #E8E8E8;">
          <button onclick="register()" class="btn btn-primary" style="width: 100%; margin-bottom: 15px;">Create Account</button>
          <button onclick="showLoginForm()" class="btn btn-ghost" style="width: 100%;">Already have an account?</button>
        </div>
        
        <div id="authMessage" style="margin-top: 15px; color: #00D4FF;"></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Switch to register form
function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authMessage').textContent = '';
}

// Switch to login form
function showLoginForm() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('authMessage').textContent = '';
}

// Login function
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageEl = document.getElementById('authMessage');
  
  if (!email || !password) {
    messageEl.textContent = 'Please fill in all fields';
    messageEl.style.color = '#FF00FF';
    return;
  }
  
  try {
    messageEl.textContent = 'Logging in...';
    messageEl.style.color = '#00D4FF';
    
    const response = await fetch('https://aimint-backend-api.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.user;
      authToken = data.token;
      
      // Save to localStorage
      localStorage.setItem('aimint_token', authToken);
      localStorage.setItem('aimint_user', JSON.stringify(currentUser));
      
      messageEl.textContent = 'Login successful!';
      messageEl.style.color = '#00D4FF';
      
      // Close modal and update UI
      setTimeout(() => {
        document.querySelector('.auth-modal').remove();
        updateUIForLoggedInUser();
      }, 1000);
      
    } else {
      messageEl.textContent = data.error || 'Login failed';
      messageEl.style.color = '#FF00FF';
    }
    
  } catch (error) {
    console.error('Login error:', error);
    messageEl.textContent = 'Network error. Please try again.';
    messageEl.style.color = '#FF00FF';
  }
}

// Register function
async function register() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const messageEl = document.getElementById('authMessage');
  
  if (!name || !email || !password) {
    messageEl.textContent = 'Please fill in all fields';
    messageEl.style.color = '#FF00FF';
    return;
  }
  
  if (password.length < 6) {
    messageEl.textContent = 'Password must be at least 6 characters';
    messageEl.style.color = '#FF00FF';
    return;
  }
  
  try {
    messageEl.textContent = 'Creating your account...';
    messageEl.style.color = '#00D4FF';
    
    const response = await fetch('https://aimint-backend-api.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      messageEl.textContent = 'Account created! Logging you in...';
      messageEl.style.color = '#00D4FF';
      
      // Auto-login after registration
      setTimeout(() => login(), 1500);
      
    } else {
      messageEl.textContent = data.error || 'Registration failed';
      messageEl.style.color = '#FF00FF';
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    messageEl.textContent = 'Network error. Please try again.';
    messageEl.style.color = '#FF00FF';
  }
}

// Update UI when user is logged in
function updateUIForLoggedInUser() {
  // Update navigation
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #00D4FF;">
        <span style="color: #E8E8E8;">${currentUser.name}</span>
        <button onclick="logout()" class="btn btn-ghost">Logout</button>
      </div>
    `;
  }
  
  // Enable upload functionality
  setupUploadFunctionality();
}

// Logout function
function logout() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem('aimint_token');
  localStorage.removeItem('aimint_user');
  location.reload(); // Refresh to show auth modal
}

// Setup upload functionality (only for logged-in users)
function setupUploadFunctionality() {
  const uploadBtn = document.getElementById('uploadBtn');
  const videoUpload = document.getElementById('videoUpload');
  const uploadMessage = document.getElementById('uploadMessage');
  const uploadProgress = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  if (uploadBtn && videoUpload) {
    uploadBtn.addEventListener('click', async () => {
      if (!currentUser) {
        uploadMessage.textContent = 'Please login to upload videos';
        return;
      }

      const file = videoUpload.files[0];
      if (!file) {
        uploadMessage.textContent = 'Please select a video file';
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        uploadMessage.textContent = 'File too large (max 100MB)';
        return;
      }

      try {
        uploadMessage.textContent = 'Preparing upload...';
        uploadBtn.disabled = true;

        // Get signed URL from backend with auth
        const signResponse = await fetch('https://aimint-backend-api.onrender.com/api/upload/sign', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type
          })
        });

        const { uploadUrl, publicUrl } = await signResponse.json();

        // Upload directly to S3
        uploadMessage.textContent = 'Uploading...';
        uploadProgress.style.display = 'block';

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressBar.style.width = percent + '%';
            progressText.textContent = Math.round(percent) + '%';
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            uploadMessage.textContent = 'Upload successful! Video added to gallery.';
            uploadMessage.style.color = '#00D4FF';
            videoUpload.value = '';
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
            uploadProgress.style.display = 'none';
            loadVideoGallery();
          } else {
            uploadMessage.textContent = 'Upload failed';
          }
          uploadBtn.disabled = false;
        };

        xhr.onerror = () => {
          uploadMessage.textContent = 'Upload error';
          uploadBtn.disabled = false;
        };

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);

      } catch (error) {
        console.error('Upload error:', error);
        uploadMessage.textContent = 'Upload failed: ' + error.message;
        uploadBtn.disabled = false;
      }
    });
  }
}

// Video gallery functionality
async function loadVideoGallery() {
  const videoGallery = document.getElementById('videoGallery');
  const refreshGallery = document.getElementById('refreshGallery');

  try {
    const response = await fetch('https://aimint-backend-api.onrender.com/api/videos');
    const data = await response.json();
    
    if (data.success && data.videos.length > 0) {
      displayVideos(data.videos);
    } else {
      displayNoVideos();
    }
  } catch (error) {
    console.error('Failed to load gallery:', error);
    displayNoVideos();
  }

  function displayVideos(videos) {
    videoGallery.innerHTML = videos.map(video => `
      <div class="video-card">
        <div class="video-thumbnail">
          <span style="font-size: 24px;">▶️</span>
        </div>
        <div class="video-info">
          <div class="video-title">${video.fileName}</div>
          <div class="video-meta">
            <span>${new Date(video.uploadDate).toLocaleDateString()}</span>
            <span>${video.views} views</span>
          </div>
          <div style="margin-top: 8px;">
            <button onclick="playVideo('${video.publicUrl}')" class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;">Play</button>
            <button onclick="likeVideo('${video.id}')" class="btn btn-ghost" style="padding: 4px 12px; font-size: 12px;">❤️ ${video.likes}</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function displayNoVideos() {
    videoGallery.innerHTML = `
      <div class="video-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <div class="video-thumbnail">🎥</div>
        <div class="video-info">
          <div class="video-title">No videos yet</div>
          <p class="muted">Be the first to upload a video!</p>
        </div>
      </div>
    `;
  }

  // Refresh gallery button
  if (refreshGallery) {
    refreshGallery.addEventListener('click', loadVideoGallery);
  }
}

// Global functions for video actions
window.playVideo = (url) => {
  window.open(url, '_blank');
};

window.likeVideo = (id) => {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  alert('Like feature coming soon!');
};

// Beta signup function
const ctaJoin = document.getElementById('ctaJoin');
const joinBtn = document.getElementById('joinBtn');

if(ctaJoin) ctaJoin.addEventListener('click', ()=> {
  const email = prompt('Enter your email for beta access:');
  const name = prompt('Enter your name:');
  if(email && name) {
    fetch('https://aimint-backend-api.onrender.com/api/beta-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    })
    .then(response => response.json())
    .then(data => alert('Success! ' + data.message))
    .catch(error => alert('Error: ' + error));
  }
});

if(joinBtn) joinBtn.addEventListener('click', ()=> ctaJoin && ctaJoin.click());
