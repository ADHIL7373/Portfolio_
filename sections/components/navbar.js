document.getElementById("navbar").innerHTML = `
<nav class="nav">
  <div class="nav-logo">➤ ADHIL</div>
  <ul>
    <li><a href="#hero">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href="#projects">Certificates</a></li>
    <li><a href="#network">Network</a></li>
    <li><a href="#router-sim">Simulation</a></li>
    <li><a href="#dashboard">Dashboard</a></li>
  </ul>
</nav>
`;

// Smooth scrolling - only on explicit user click, not on page load
let isPageLoaded = false;

window.addEventListener('load', function() {
  isPageLoaded = true;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target && isPageLoaded) {  // Only scroll if page is fully loaded
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Use replaceState so hash never persists in URL (prevents scroll-to-hash on refresh)
      window.history.replaceState(null, null, window.location.pathname);
    }
  });
});