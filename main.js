// Show user dashboard
function showDashboard() {
  document.getElementById('userDashboard').style.display = 'block';
  document.querySelector('main').style.display = 'none';
  loadUserVideos();
  updateDashboardStats();
}

// Hide dashboard and show main content
function hideDashboard() {
  document.getElementById('userDashboard').style.display = 'none';
  document.querySelector('main').style.display = 'block';
}

// Load user's videos
async function loadUserVideos() {
  const userVideosContainer = document.getElementById('userVideos');
  
  // For now, we'll show all videos. Later we'll filter by user
  try {
    const response = await fetch('https://aimint-backend-api.onrender.com/api/videos');
    const data = await response.json();
    
    if (data.success && data.videos.length > 0) {
      const userVideos = data.videos; // Later: filter by currentUser.id
      
      userVideosContainer.innerHTML = userVideos.map(video => `
        <div class="video-card">
          <div class="video-thumbnail">
            <span style="font-size: 24px;">▶️</span>
          </div>
          <div class="video-info">
            <div class="video-title">${video.fileName}</div>
            <div class="video-meta">
              <span>${new Date(video.uploadDate).toLocaleDateString()}</span>
              <span>${video.views} views</span>
              <span>❤️ ${video.likes}</span>
            </div>
            <div style="margin-top: 8px; display: flex; gap: 8px;">
              <button onclick="playVideo('${video.publicUrl}')" class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;">Play</button>
              <button onclick="editVideo('${video.id}')" class="btn btn-ghost" style="padding: 4px 12px; font-size: 12px;">Edit</button>
              <button onclick="deleteVideo('${video.id}')" class="btn btn-ghost" style="padding: 4px 12px; font-size: 12px; color: #FF00FF;">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      userVideosContainer.innerHTML = `
        <div class="video-card" style="text-align: center; padding: 40px; grid-column: 1 / -1;">
          <div class="video-thumbnail">📹</div>
          <div class="video-info">
            <div class="video-title">No videos uploaded yet</div>
            <p class="muted">Start uploading to build your video portfolio!</p>
            <button class="btn btn-primary" onclick="showUploadSection()" style="margin-top: 15px;">Upload First Video</button>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load user videos:', error);
  }
}

// Update dashboard statistics
function updateDashboardStats() {
  // For now, placeholder stats. Later we'll fetch real data
  const stats = {
    videos: 0,
    views: 0,
    likes: 0,
    followers: 0
  };
  
  document.querySelectorAll('.stat-card').forEach((card, index) => {
    const values = Object.values(stats);
    card.querySelector('div:first-child').textContent = values[index];
  });
}

// Show upload section
function showUploadSection() {
  hideDashboard();
  document.querySelector('.upload').scrollIntoView({ behavior: 'smooth' });
}

// Show analytics (placeholder)
function showAnalytics() {
  alert('📊 Advanced analytics coming next week! Track views, engagement, and revenue in real-time!');
}

// Show AI tools (placeholder)
function showAITools() {
  alert('⚡ AI Studio launching soon! Auto-enhance videos, generate captions, and create thumbnails with AI!');
}

// Edit video (placeholder)
function editVideo(videoId) {
  alert('🎬 Video editor coming soon! Trim, add effects, and enhance your videos!');
}

// Delete video (placeholder)
function deleteVideo(videoId) {
  if (confirm('Are you sure you want to delete this video?')) {
    alert('Video deleted! (This will be implemented in the next update)');
    loadUserVideos();
  }
}

// Update the updateUIForLoggedInUser function to include dashboard
function updateUIForLoggedInUser() {
  // Update navigation
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #00D4FF;">
        <span style="color: #E8E8E8;">${currentUser.name}</span>
        <button onclick="showDashboard()" class="btn btn-ghost">Dashboard</button>
        <button onclick="logout()" class="btn btn-ghost">Logout</button>
      </div>
    `;
  }
  
  // Enable upload functionality
  setupUploadFunctionality();
}
