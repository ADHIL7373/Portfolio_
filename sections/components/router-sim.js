// ════════════════════════════════════════════════════════════════
//  Router Data Transmission Simulation
//  Vanilla JS + SVG + requestAnimationFrame
//  No external dependencies — 60 fps smooth packet animation
// ════════════════════════════════════════════════════════════════

function initRouterSim() {
  const svg      = document.getElementById('rsimSVG');
  const pktLayer = document.getElementById('rsimPackets');
  if (!svg || !pktLayer) return;

  // ── Node center coordinates (match SVG viewBox exactly) ──────────────
  const N = {
    router:  { x: 400, y: 72,  id: 'rsim-router' },
    switch1: { x: 200, y: 212, id: 'rsim-sw1'    },
    switch2: { x: 600, y: 212, id: 'rsim-sw2'    },
    c1:      { x: 80,  y: 348, id: 'rsim-c1', sw: 'switch1' },
    c2:      { x: 200, y: 348, id: 'rsim-c2', sw: 'switch1' },
    c3:      { x: 320, y: 348, id: 'rsim-c3', sw: 'switch1' },
    c4:      { x: 480, y: 348, id: 'rsim-c4', sw: 'switch2' },
    c5:      { x: 600, y: 348, id: 'rsim-c5', sw: 'switch2' },
    c6:      { x: 720, y: 348, id: 'rsim-c6', sw: 'switch2' },
  };

  const CLIENT_KEYS = ['c1','c2','c3','c4','c5','c6'];

  // ── Line ID lookup: "nodeKeyA-nodeKeyB" → SVG element id ─────────────
  const LINE_MAP = {
    'router-switch1':  'rsim-ln-r-s1',
    'switch1-router':  'rsim-ln-r-s1',
    'router-switch2':  'rsim-ln-r-s2',
    'switch2-router':  'rsim-ln-r-s2',
    'switch1-c1':      'rsim-ln-s1-c1',
    'c1-switch1':      'rsim-ln-s1-c1',
    'switch1-c2':      'rsim-ln-s1-c2',
    'c2-switch1':      'rsim-ln-s1-c2',
    'switch1-c3':      'rsim-ln-s1-c3',
    'c3-switch1':      'rsim-ln-s1-c3',
    'switch2-c4':      'rsim-ln-s2-c4',
    'c4-switch2':      'rsim-ln-s2-c4',
    'switch2-c5':      'rsim-ln-s2-c5',
    'c5-switch2':      'rsim-ln-s2-c5',
    'switch2-c6':      'rsim-ln-s2-c6',
    'c6-switch2':      'rsim-ln-s2-c6',
  };

  // ── Live stats ────────────────────────────────────────────────────────
  let sent = 0, recv = 0, inTransit = 0;

  function updateStats() {
    const s = document.getElementById('rsim-stat-sent');
    const r = document.getElementById('rsim-stat-recv');
    const a = document.getElementById('rsim-stat-active');
    if (s) s.textContent = sent;
    if (r) r.textContent = recv;
    if (a) a.textContent = inTransit;
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  // Smooth ease-in-out (quadratic)
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  // Briefly add a CSS class to a node <g> for visual flash
  function flashNode(elId, cls) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 720);
  }

  // Briefly highlight a connection line
  function flashLine(fromKey, toKey) {
    const lineId = LINE_MAP[`${fromKey}-${toKey}`];
    if (!lineId) return;
    const el = document.getElementById(lineId);
    if (!el) return;
    el.classList.add('rsim-line-active');
    setTimeout(() => el.classList.remove('rsim-line-active'), 720);
  }

  // ── Packet lifecycle ──────────────────────────────────────────────────
  function spawnPacket() {
    // Random source client
    const srcKey  = CLIENT_KEYS[Math.floor(Math.random() * CLIENT_KEYS.length)];
    const srcNode = N[srcKey];

    // Prefer destination on the OPPOSITE switch (75% chance) for visual interest
    const otherSide = CLIENT_KEYS.filter(k => N[k].sw !== srcNode.sw);
    const sameSide  = CLIENT_KEYS.filter(k => N[k].sw === srcNode.sw && k !== srcKey);
    const pool      = (Math.random() < 0.75) ? otherSide : sameSide;
    const destKey   = pool[Math.floor(Math.random() * pool.length)];
    const destNode  = N[destKey];

    const srcSw  = N[srcNode.sw];   // parent switch of source
    const destSw = N[destNode.sw];  // parent switch of destination

    // Waypoint sequence: src → srcSwitch → Router → destSwitch → dest
    const pts = [
      { x: srcNode.x,  y: srcNode.y,  key: srcKey       },
      { x: srcSw.x,    y: srcSw.y,    key: srcNode.sw   },
      { x: N.router.x, y: N.router.y, key: 'router'     },
      { x: destSw.x,   y: destSw.y,   key: destNode.sw  },
      { x: destNode.x, y: destNode.y, key: destKey       },
    ];

    // Create SVG circle representing the packet
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r',  '6');
    circle.setAttribute('cx', pts[0].x);
    circle.setAttribute('cy', pts[0].y);
    circle.classList.add('rsim-packet');
    pktLayer.appendChild(circle);

    sent++;
    inTransit++;
    updateStats();

    flashNode(srcNode.id, 'rsim-node-active');

    // ── Per-segment animation via requestAnimationFrame ──────────────
    const SEG_MS = 560;
    let   seg    = 0;
    let   t0     = null;

    function tick(ts) {
      // First frame of a new segment
      if (t0 === null) {
        t0 = ts;
        flashLine(pts[seg].key, pts[seg + 1].key);
      }

      const t  = Math.min((ts - t0) / SEG_MS, 1);
      const et = ease(t);

      // Interpolate position
      const fx = pts[seg].x, fy = pts[seg].y;
      const tx = pts[seg + 1].x, ty = pts[seg + 1].y;
      circle.setAttribute('cx', fx + (tx - fx) * et);
      circle.setAttribute('cy', fy + (ty - fy) * et);

      // Scale the packet up slightly while approaching / leaving the router
      const grow = (seg === 1) ? t * 3 : (seg === 2) ? (1 - t) * 3 : 0;
      circle.setAttribute('r', 6 + grow);

      // Keep animating until segment complete
      if (t < 1) { requestAnimationFrame(tick); return; }

      // ── Segment complete ────────────────────────────────────────────
      const arrivedAt = pts[seg + 1].key;

      if (arrivedAt === 'router') {
        flashNode(N.router.id, 'rsim-node-processing');
      } else {
        const nodeId = N[arrivedAt] && N[arrivedAt].id;
        if (nodeId) flashNode(nodeId, 'rsim-node-active');
      }

      seg++;
      t0 = null;

      if (seg < pts.length - 1) {
        // More segments to travel
        requestAnimationFrame(tick);
      } else {
        // Final destination reached — flash then fade out
        flashNode(destNode.id, 'rsim-node-arrived');
        circle.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' });
        setTimeout(() => {
          circle.remove();
          inTransit = Math.max(0, inTransit - 1);
          recv++;
          updateStats();
        }, 320);
      }
    }

    requestAnimationFrame(tick);
  }

  // ── Periodic ambient line pulse (every 5 s) ───────────────────────────
  setInterval(() => {
    document.querySelectorAll('.rsim-line').forEach((ln, i) => {
      setTimeout(() => {
        ln.classList.add('rsim-line-active');
        setTimeout(() => ln.classList.remove('rsim-line-active'), 500);
      }, i * 80);
    });
  }, 5000);

  // ── Packet spawn scheduler ────────────────────────────────────────────
  let _spawnTimer = null;

  function schedule() {
    const delay = 700 + Math.random() * 500;
    _spawnTimer = setTimeout(() => { spawnPacket(); schedule(); }, delay);
  }

  // Initial burst so the simulation looks alive immediately
  setTimeout(spawnPacket,  80);
  setTimeout(spawnPacket, 300);
  setTimeout(spawnPacket, 580);
  schedule();

  // Expose cleanup for potential SPA teardown
  window.rsimDestroy = () => clearTimeout(_spawnTimer);
}
