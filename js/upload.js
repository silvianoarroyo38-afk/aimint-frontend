// Video Upload System
let uploadedVideos = JSON.parse(localStorage.getItem('aimint_videos')) || [];

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
            thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            id: 2,
            title: "Cyberpunk Cityscape",
            creator: "@FutureVisions", 
            views: "5.7K",
            likes: "3.1K",
            tools: ["Stable Diffusion", "After Effects"],
            thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        {
            id: 3, 
            title: "Holographic Interface Design",
            creator: "@UX_AI",
            views: "1.8K",
            likes: "892",
            tools: ["DALL-E 3", "Figma"],
            thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        }
    ];
    saveVideos();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderVideoGrid();
    setupUploadHandlers();
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
    return card;
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

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeUploadModal();
    }
});
