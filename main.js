document.addEventListener('DOMContentLoaded', ()=>{
  const themeToggle = document.getElementById('themeToggle');
  const ctaJoin = document.getElementById('ctaJoin');
  const joinBtn = document.getElementById('joinBtn');
  const stored = localStorage.getItem('aim_theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  function applyTheme(t){ document.documentElement.classList.toggle('theme-light', t==='light'); localStorage.setItem('aim_theme', t); }
  applyTheme(stored || (prefersLight ? 'light' : 'dark'));
  if(themeToggle) themeToggle.addEventListener('click', ()=> applyTheme(document.documentElement.classList.contains('theme-light') ? 'dark' : 'light'));
  if(ctaJoin) ctaJoin.addEventListener('click', ()=> alert('Join Beta — signup modal (demo)'));
  if(joinBtn) joinBtn.addEventListener('click', ()=> ctaJoin && ctaJoin.click());
});
