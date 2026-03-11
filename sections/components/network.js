function initNetworkTraffic() {
  const svg = document.getElementById("netSVG");
  if (!svg) return;

  // â”€â”€ Node centres â€” match SVG positions exactly â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const NODES = {
    wan: { x: 430, y: 38  },
    fw:  { x: 430, y: 104 },
    rtr: { x: 430, y: 188 },
    sw1: { x: 200, y: 301 },
    sw2: { x: 660, y: 301 },
    web: { x: 55,  y: 410 },
    db:  { x: 175, y: 410 },
    app: { x: 295, y: 410 },
    pc1: { x: 520, y: 410 },
    pc2: { x: 650, y: 410 },
    pc3: { x: 780, y: 410 },
  };

  // â”€â”€ Realistic hop-by-hop routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const ROUTES = [
    // HTTP/HTTPS â€” internet requests to web server
    ["wan","fw","rtr","sw1","web"],
    ["wan","fw","rtr","sw1","web"],
    // Responses back to internet
    ["web","sw1","rtr","fw","wan"],
    // DNS queries from users to internet
    ["pc1","sw2","rtr","fw","wan"],
    ["pc2","sw2","rtr","fw","wan"],
    ["pc3","sw2","rtr","fw","wan"],
    // SSH admin sessions
    ["pc1","sw2","rtr","sw1","app"],
    ["pc2","sw2","rtr","sw1","web"],
    ["pc3","sw2","rtr","sw1","db"],
    // App server â†” DB (intra-VLAN via switch)
    ["app","sw1","db"],
    ["db","sw1","app"],
    // ICMP ping / diagnostics from router
    ["rtr","sw1","web"],
    ["rtr","sw2","pc1"],
    ["rtr","sw2","pc2"],
    // TCP bulk transfer
    ["pc1","sw2","rtr","sw1","app"],
    ["app","sw1","rtr","sw2","pc3"],
  ];

  const PROTOCOLS = [
    { name:"HTTP",  color:"#00d4ff", grad:"url(#pkt-http)" },
    { name:"SSH",   color:"#7c3aed", grad:"url(#pkt-ssh)"  },
    { name:"ICMP",  color:"#00ff88", grad:"url(#pkt-icmp)" },
    { name:"DNS",   color:"#fbbf24", grad:"url(#pkt-dns)"  },
    { name:"TCP",   color:"#f87171", grad:"url(#pkt-tcp)"  },
  ];

  const pktLayer = document.getElementById("netPackets");
  let sent = 0, recv = 0, inFlight = 0;

  const elSent    = document.getElementById("net-sent");
  const elRecv    = document.getElementById("net-recv");
  const elTransit = document.getElementById("net-transit");

  function updateStats() {
    if (elSent)    elSent.textContent    = sent;
    if (elRecv)    elRecv.textContent    = recv;
    if (elTransit) elTransit.textContent = inFlight;
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function flashNode(id) {
    const el = document.getElementById("net-" + id);
    if (!el) return;
    el.classList.add("net-node-active");
    setTimeout(() => el.classList.remove("net-node-active"), 320);
  }

  function flashLine(a, b) {
    const el = document.getElementById(`net-ln-${a}-${b}`) ||
               document.getElementById(`net-ln-${b}-${a}`);
    if (!el) return;
    el.classList.add("net-line-active");
    setTimeout(() => el.classList.remove("net-line-active"), 500);
  }

  function animatePacket(route, proto) {
    let hopIdx = 0;
    inFlight++;
    sent++;
    updateStats();

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.pointerEvents = "none";

    const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circ.setAttribute("r", "6");
    circ.setAttribute("fill", proto.grad);
    circ.style.filter = `drop-shadow(0 0 5px ${proto.color})`;

    const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl.setAttribute("dy", "-9");
    lbl.setAttribute("text-anchor", "middle");
    lbl.setAttribute("font-size", "7");
    lbl.setAttribute("font-family", "JetBrains Mono, monospace");
    lbl.setAttribute("fill", proto.color);
    lbl.setAttribute("font-weight", "700");
    lbl.textContent = proto.name;

    g.appendChild(circ);
    g.appendChild(lbl);
    pktLayer.appendChild(g);

    const startNode = NODES[route[0]];
    g.setAttribute("transform", `translate(${startNode.x},${startNode.y})`);
    flashNode(route[0]);

    function doHop() {
      if (hopIdx >= route.length - 1) {
        inFlight--;
        recv++;
        updateStats();
        flashNode(route[route.length - 1]);
        g.remove();
        return;
      }
      const from = NODES[route[hopIdx]];
      const to   = NODES[route[hopIdx + 1]];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Math.max(420, dist * 2.4);

      flashLine(route[hopIdx], route[hopIdx + 1]);
      flashNode(route[hopIdx]);

      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const raw = Math.min((ts - start) / duration, 1);
        const t = ease(raw);
        g.setAttribute("transform",
          `translate(${from.x + dx * t},${from.y + dy * t})`);
        if (raw < 1) {
          requestAnimationFrame(step);
        } else {
          hopIdx++;
          doHop();
        }
      }
      requestAnimationFrame(step);
    }

    doHop();
  }

  function spawnPacket() {
    const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
    const proto = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
    animatePacket(route, proto);
  }

  let spawnTimer;
  function scheduleNext() {
    const delay = 700 + Math.random() * 800;
    spawnTimer = setTimeout(() => { spawnPacket(); scheduleNext(); }, delay);
  }

  scheduleNext();
  window._netSimStop = () => clearTimeout(spawnTimer);
}
