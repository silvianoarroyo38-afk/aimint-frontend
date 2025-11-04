document.addEventListener('DOMContentLoaded', ()=>{
  // FORCE DARK THEME - Remove all theme switching
  document.documentElement.classList.remove('theme-light');
  document.documentElement.style.background = '#0A041C';
  document.body.style.background = '#0A041C';
  
  // Remove theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.style.display = 'none';
  }
  
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
  
  // Video upload functionality
  const uploadBtn = document.getElementById('uploadBtn');
  const videoUpload = document.getElementById('videoUpload');
  const uploadMessage = document.getElementById('uploadMessage');
  const uploadProgress = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  if (uploadBtn && videoUpload) {
    uploadBtn.addEventListener('click', async () => {
      const file = videoUpload.files[0];
      if (!file) {
        uploadMessage.textContent = 'Please select a video file';
        return;
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        uploadMessage.textContent = 'File too large (max 100MB)';
        return;
      }

      try {
        uploadMessage.textContent = 'Preparing upload...';
        uploadBtn.disabled = true;

        // Get signed URL from backend
        const signResponse = await fetch('https://aimint-backend-api.onrender.com/api/upload/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            // Refresh gallery after upload
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

  // Video gallery functionality
  const videoGallery = document.getElementById('videoGallery');
  const refreshGallery = document.getElementById('refreshGallery');

  // Load video gallery from backend
  async function loadVideoGallery() {
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
  }

  // Display videos in gallery
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

  // Display message when no videos
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

  // Global functions for video actions
  window.playVideo = (url) => {
    window.open(url, '_blank');
  };

  window.likeVideo = (id) => {
    alert('Like feature coming soon!');
  };

  // Load gallery on page load
  loadVideoGallery();

  // Refresh gallery button
  if (refreshGallery) {
    refreshGallery.addEventListener('click', loadVideoGallery);
  }
});
