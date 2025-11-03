document.addEventListener('DOMContentLoaded', ()=>{
  const themeToggle = document.getElementById('themeToggle');
  const ctaJoin = document.getElementById('ctaJoin');
  const joinBtn = document.getElementById('joinBtn');
  const stored = localStorage.getItem('aim_theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  function applyTheme(t){ document.documentElement.classList.toggle('theme-light', t==='light'); localStorage.setItem('aim_theme', t); }
  applyTheme(stored || (prefersLight ? 'light' : 'dark'));
  if(themeToggle) themeToggle.addEventListener('click', ()=> applyTheme(document.documentElement.classList.contains('theme-light') ? 'dark' : 'light'));
  
  // Fixed beta signup function
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
});
