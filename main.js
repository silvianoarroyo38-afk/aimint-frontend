document.addEventListener('DOMContentLoaded', ()=>{
  const themeToggle = document.getElementById('themeToggle');
  const ctaJoin = document.getElementById('ctaJoin');
  const joinBtn = document.getElementById('joinBtn');
  const stored = localStorage.getItem('aim_theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  function applyTheme(t){ document.documentElement.classList.toggle('theme-light', t==='light'); localStorage.setItem('aim_theme', t); }
  applyTheme(stored || (prefersLight ? 'light' : 'dark'));
  if(themeToggle) themeToggle.addEventListener('click', ()=> applyTheme(document.documentElement.classList.contains('theme-light') ? 'dark' : 'light'));
  
  // Beta signup function
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
            uploadMessage.textContent = 'Upload successful!';
            uploadMessage.style.color = 'green';
            videoUpload.value = '';
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
            uploadProgress.style.display = 'none';
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
});
