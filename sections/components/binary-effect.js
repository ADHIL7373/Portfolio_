// ════════════════════════════════════════════════════════
//  Binary Rain Effect  —  0s & 1s that drift up from the
//  cursor whenever it moves over a simulation section.
// ════════════════════════════════════════════════════════

function initBinaryEffect() {
  // Target both simulation containers
  const SELECTORS = [
    '.rsim-wrapper',
    '.network-traffic-container'
  ];

  SELECTORS.forEach(sel => {
    const target = document.querySelector(sel);
    if (!target) return;

    let lastSpawn = 0;

    target.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSpawn < 75) return;   // throttle: max ~13 bits/s
      lastSpawn = now;

      // Spawn 1–2 bits per event for a denser feel
      const count = Math.random() < 0.4 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const bit  = document.createElement('span');
        bit.className = 'binary-bit';
        bit.textContent = Math.random() < 0.5 ? '0' : '1';

        // Random scatter around the cursor
        const ox = (Math.random() - 0.5) * 48;
        const oy = (Math.random() - 0.5) * 24;

        bit.style.left = (e.clientX + ox) + 'px';
        bit.style.top  = (e.clientY + oy) + 'px';

        // Slight size variation for depth
        const size = 11 + Math.random() * 5;
        bit.style.fontSize = size + 'px';

        // Slightly varied float distance & duration
        const rise    = 55 + Math.random() * 50;
        const dur     = 1000 + Math.random() * 500;
        const driftX  = (Math.random() - 0.5) * 20;

        bit.style.setProperty('--rise',   `-${rise}px`);
        bit.style.setProperty('--driftX',  `${driftX}px`);
        bit.style.animationDuration = dur + 'ms';

        document.body.appendChild(bit);
        setTimeout(() => bit.remove(), dur + 50);
      }
    });

    // Burst effect on enter — 8 bits scatter from the center of the target
    target.addEventListener('mouseenter', () => {
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const bit = document.createElement('span');
        bit.className = 'binary-bit binary-bit-burst';
        bit.textContent = Math.random() < 0.5 ? '0' : '1';

        const angle = (i / 8) * Math.PI * 2;
        const radius = 60 + Math.random() * 80;
        bit.style.left = (cx + Math.cos(angle) * radius * 0.25) + 'px';
        bit.style.top  = (cy + Math.sin(angle) * radius * 0.15) + 'px';
        bit.style.fontSize = (10 + Math.random() * 6) + 'px';

        const rise   = 40 + Math.random() * 60;
        const driftX = (Math.random() - 0.5) * 30;
        const dur    = 900 + Math.random() * 600;

        bit.style.setProperty('--rise',   `-${rise}px`);
        bit.style.setProperty('--driftX',  `${driftX}px`);
        bit.style.animationDuration = dur + 'ms';
        bit.style.animationDelay    = (i * 40) + 'ms';

        document.body.appendChild(bit);
        setTimeout(() => bit.remove(), dur + i * 40 + 100);
      }
    });
  });
}
