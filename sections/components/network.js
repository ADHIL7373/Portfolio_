function initNetworkTraffic() {
  const nodes = document.querySelectorAll(".traffic-node");
  const canvas = document.getElementById("networkCanvas");

  if (!nodes.length || !canvas) return;

  function sendPacket() {
    const start = nodes[Math.floor(Math.random() * nodes.length)];
    let end = nodes[Math.floor(Math.random() * nodes.length)];
    
    if (start === end) return;

    const packet = document.createElement("div");
    packet.className = "packet";
    canvas.appendChild(packet);

    const r1 = start.getBoundingClientRect();
    const r2 = end.getBoundingClientRect();
    const p = canvas.getBoundingClientRect();

    const x1 = r1.left - p.left + r1.width / 2;
    const y1 = r1.top - p.top + r1.height / 2;

    const x2 = r2.left - p.left + r2.width / 2;
    const y2 = r2.top - p.top + r2.height / 2;

    packet.style.left = x1 + "px";
    packet.style.top = y1 + "px";

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const duration = Math.max(1500, distance * 2);

    packet.animate(
      [
        { transform: `translate(0, 0)` },
        { transform: `translate(${x2 - x1}px, ${y2 - y1}px)` }
      ],
      {
        duration: duration,
        easing: "linear"
      }
    );

    setTimeout(() => packet.remove(), duration);
  }

  // Send packets every 700-900ms
  const interval = setInterval(sendPacket, Math.random() * 200 + 700);
  
  // Store interval for cleanup if needed
  window.networkInterval = interval;
}
