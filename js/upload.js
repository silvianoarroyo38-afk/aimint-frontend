// Video Upload System
let uploadedVideos = JSON.parse(localStorage.getItem('aimint_videos')) || [];
let currentPlayingVideo = null;

// Sample videos if none exist
if (uploadedVideos.length === 0) {
    uploadedVideos = [
        {
            id: 1,
            title: "Neural Dreams - AI Animation",
            creator: "@AI_Animator",
            views: "2.4K",
            likes: "1.2K",
            tools: ["RunwayML", "Midjourney"],
            thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            description: "Exploring the boundaries of AI-generated animation using neural networks and creative prompting techniques."
        },
        {
            id: 2,
            title: "Cyberpunk Cityscape",
            creator: "@FutureVisions", 
            views: "5.7K",
            likes: "3.1K",
            tools: ["Stable Diffusion", "After Effects"],
            thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            description: "A futuristic cityscape generated through AI and enhanced with visual effects compositing."
        },
        {
            id: 3, 
            title: "Holographic Interface Design",
            creator: "@UX_AI",
            views: "1.8K",
            likes: "892",
            tools: ["DALL-E 3", "Figma"],
            thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            description: "Designing the future of user interfaces with AI-generated holographic elements and interactions."
        }
    ];
    saveVideos();
}

// Waitlist System
function joinWaitlist() {
    const email = document.getElementById('waitlistEmail').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Save to localStorage
    let waitlist = JSON.parse(localStorage.getItem('aimint_waitlist')) || [];
    if (!waitlist.includes(email)) {
        waitlist.push(email);
        localStorage.setItem('aimint_waitlist', JSON.stringify(waitlist));
    }
    
    // Update count
    updateWaitlistCount();
    
    // Show confirmation
    alert('🎉 Welcome to the AIMint waitlist! We\'ll contact you soon with early access.');
    document.getElementById('waitlistEmail').value = '';
}

function updateWaitlistCount() {
    const waitlist = JSON.parse(localStorage.getItem('aimint_waitlist')) || [];
    const baseCount = 127; // Starting count
    const totalCount = baseCount + waitlist.length;
    document.getElementById('waitlistCount').textContent = totalCount;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderVideoGrid();
    setupUploadHandlers();
    updateStats();
    updateWaitlistCount();
});

// Render video grid
function renderVideoGrid() {
    const videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = '';

    uploadedVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoGrid.appendChild(videoCard);
    });
}

// Create video card HTML
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail" style="background: ${video.thumbnail};">
            <div class="play-icon">▶</div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-creator">by ${video.creator}</p>
            <div class="video-stats">
                <span>🎬 ${video.views}</span>
                <span>❤️ ${video.likes}</span>
            </div>
            <div class="ai-tools">
                ${video.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Add click event to play video
    card.addEventListener('click', function() {
        playVideo(video);
    });
    
    return card;
}

// Play video in modal
function playVideo(video) {
    currentPlayingVideo = video;
    
    // Update player content
    document.getElementById('playerTitle').textContent = video.title;
    document.getElementById('playerCreator').textContent = `by ${video.creator}`;
    document.getElementById('playerDescription').textContent = video.description;
    document.getElementById('playerViews').textContent = video.views;
    document.getElementById('playerLikes').textContent = video.likes;
    
    // Update tools
    const toolsList = document.getElementById('playerTools');
    toolsList.innerHTML = video.tools.map(tool => 
        `<span class="tool-tag">${tool}</span>`
    ).join('');
    
    // Show modal
    document.getElementById('videoPlayerModal').style.display = 'flex';
    
    // Increment views (simulated)
    incrementViews(video.id);
}

// Close video player
function closeVideoPlayer() {
    document.getElementById('videoPlayerModal').style.display = 'none';
    currentPlayingVideo = null;
}

// Like video
function likeVideo() {
    if (currentPlayingVideo) {
        // Convert likes string to number for manipulation
        const currentLikes = parseFloat(currentPlayingVideo.likes) * (currentPlayingVideo.likes.includes('K') ? 1000 : 1);
        const newLikes = currentLikes + 1;
        currentPlayingVideo.likes = newLikes >= 1000 ? (newLikes / 1000).toFixed(1) + 'K' : newLikes.toString();
        
        // Update display
        document.getElementById('playerLikes').textContent = currentPlayingVideo.likes;
        
        // Update in storage
        const videoIndex = uploadedVideos.findIndex(v => v.id === currentPlayingVideo.id);
        if (videoIndex !== -1) {
            uploadedVideos[videoIndex].likes = currentPlayingVideo.likes;
            saveVideos();
            renderVideoGrid();
            updateStats();
        }
        
        // Show feedback
        const likeBtn = document.querySelector('.like-btn');
        likeBtn.style.background = 'linear-gradient(135deg, #FF00FF 0%, #2D1B69 100%)';
        likeBtn.textContent = '❤️ Liked!';
        setTimeout(() => {
            likeBtn.style.background = '';
            likeBtn.textContent = '❤️ Like';
        }, 2000);
    }
}

// Increment views
function incrementViews(videoId) {
    const videoIndex = uploadedVideos.findIndex(v => v.id === videoId);
    if (videoIndex !== -1) {
        const video = uploadedVideos[videoIndex];
        const currentViews = parseFloat(video.views) * (video.views.includes('K') ? 1000 : 1);
        const newViews = currentViews + 1;
        video.views = newViews >= 1000 ? (newViews / 1000).toFixed(1) + 'K' : newViews.toString();
        
        saveVideos();
        renderVideoGrid();
        updateStats();
    }
}

// Remix video
function remixVideo() {
    if (currentPlayingVideo) {
        alert(`🎨 Time to remix "${currentPlayingVideo.title}"!\n\nThis would open the AI tools used to create your own version.`);
    }
}

// Share video
function shareVideo() {
    if (currentPlayingVideo) {
        const shareUrl = `https://aimint-frontend.vercel.app?video=${currentPlayingVideo.id}`;
        alert(`📤 Share "${currentPlayingVideo.title}"!\n\nShare URL: ${shareUrl}\n\n(Copy this link to share)`);
    }
}

// Update platform stats
function updateStats() {
    const totalCreations = uploadedVideos.length;
    const totalViews = uploadedVideos.reduce((sum, video) => {
        const views = parseFloat(video.views) * (video.views.includes('K') ? 1000 : 1);
        return sum + views;
    }, 0);
    
    document.getElementById('totalCreations').textContent = totalCreations;
    document.getElementById('totalViews').textContent = totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews;
    
    // Count unique creators
    const creators = new Set(uploadedVideos.map(video => video.creator));
    document.getElementById('totalCreators').textContent = creators.size;
}

// Upload Modal Functions
function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'flex';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    resetUploadForm();
}

function triggerFileInput() {
    document.getElementById('fileInput').click();
}

// Setup upload handlers
function setupUploadHandlers() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');

    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#00D4FF';
        uploadArea.style.background = 'rgba(0, 212, 255, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#00D4FF';
        uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files: files } });
        }
    });
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Show upload form
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('uploadForm').style.display = 'block';
        
        // Simulate file processing
        console.log('File selected:', file.name);
    }
}

// Submit video
function submitVideo() {
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const toolCheckboxes = document.querySelectorAll('.tool-checkbox input:checked');
    const tools = Array.from(toolCheckboxes).map(cb => cb.value);

    if (!title) {
        alert('Please enter a video title');
        return;
    }

    // Show progress
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'block';

    // Simulate upload progress
    simulateUploadProgress(() => {
        // Create new video
        const newVideo = {
            id: Date.now(),
            title: title,
            creator: "@You", 
            views: "0",
            likes: "0", 
            tools: tools,
            thumbnail: getRandomGradient(),
            description: description
        };

        // Add to videos array
        uploadedVideos.unshift(newVideo);
        saveVideos();
        
        // Update UI
        renderVideoGrid();
        updateStats();
        closeUploadModal();
        
        // Show success message
        alert('🎉 Your AI creation has been published!');
    });
}

// Simulate upload progress
function simulateUploadProgress(callback) {
    const progressFill = document.getElementById('progressFill');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(callback, 500);
        } else {
            width += 10;
            progressFill.style.width = width + '%';
        }
    }, 200);
}

// Reset upload form
function resetUploadForm() {
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoDescription').value = '';
    document.querySelectorAll('.tool-checkbox input').forEach(cb => cb.checked = false);
    document.getElementById('progressFill').style.width = '0%';
}

// Save videos to localStorage
function saveVideos() {
    localStorage.setItem('aimint_videos', JSON.stringify(uploadedVideos));
}

// Load more videos
function loadMoreVideos() {
    alert('Loading more amazing AI creations...');
}

// Scroll to videos
function scrollToVideos() {
    document.getElementById('videoSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Random gradient for thumbnails
function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeUploadModal();
        closeVideoPlayer();
    }
});
