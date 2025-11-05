document.addEventListener('DOMContentLoaded', function() {
  console.log('AIMint loaded successfully!');
  
  // Simple beta signup
  const ctaJoin = document.getElementById('ctaJoin');
  if (ctaJoin) {
    ctaJoin.addEventListener('click', function() {
      const email = prompt('Enter your email for beta access:');
      if (email) {
        alert('Thanks! We\'ll contact you at ' + email);
      }
    });
  }
  
  const joinBtn = document.getElementById('joinBtn');
  if (joinBtn) {
    joinBtn.addEventListener('click', function() {
      const email = prompt('Enter your email for beta access:');
      if (email) {
        alert('Thanks! We\'ll contact you at ' + email);
      }
    });
  }

  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      alert('Explore feature coming soon!');
    });
  }
});
