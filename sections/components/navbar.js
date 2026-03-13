document.getElementById("navbar").innerHTML = `
<nav class="nav" id="mainNav">
  <div class="nav-logo"><span class="logo-arrow">&#9658;</span><span class="logo-name">ADHIL</span></div>
  <button class="nav-hamburger" id="navHamburger" aria-label="Toggle navigation">☰</button>
  <ul id="navLinks">
    <li><a href="#hero">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href="#projects">Certificates</a></li>
    <li><a href="#projects-section">Projects</a></li>
    <li><a href="#router-sim">Terminal</a></li>
    <li><a href="#dashboard">Dashboard</a></li>
  </ul>
</nav>
`;

// Hamburger toggle
const hamburger = document.getElementById('navHamburger');
const mainNav   = document.getElementById('mainNav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('nav-open');
    hamburger.textContent = mainNav.classList.contains('nav-open') ? '✕' : '☰';
  });
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      hamburger.textContent = '☰';
    });
  });
}

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