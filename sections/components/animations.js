// Called after all sections are injected into the DOM
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  });

  // Observe all containers and cards
  document.querySelectorAll(".container, .qualification-card, .skill-card, .network-skill-card, .certificate-card, .topology-container, .network-traffic-container, .terminal-container, .dashboard-card").forEach((el) => {
    observer.observe(el);
  });
}