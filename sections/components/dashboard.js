function initDashboard() {
  const statusValue = document.getElementById("status-value");
  const devicesValue = document.getElementById("devices-value");
  const packetValue = document.getElementById("packet-value");
  const cpuValue = document.getElementById("cpu-value");
  const bandwidthValue = document.getElementById("bandwidth-value");
  const latencyValue = document.getElementById("latency-value");
  
  const packetProgress = document.getElementById("packet-progress");
  const cpuProgress = document.getElementById("cpu-progress");
  const bandwidthProgress = document.getElementById("bandwidth-progress");

  if (!statusValue) return;

  // Simulate dynamic data updates
  setInterval(() => {
    // Connected Devices (random 8-15)
    const devices = Math.floor(Math.random() * 8) + 8;
    devicesValue.textContent = devices;

    // Packet Flow Rate (random 20-85 Mbps)
    const packets = Math.floor(Math.random() * 65) + 20;
    packetValue.textContent = packets + " Mbps";
    packetProgress.style.setProperty("--progress-width", packets + "%");

    // CPU Load (random 15-60%)
    const cpu = Math.floor(Math.random() * 45) + 15;
    cpuValue.textContent = cpu + "%";
    cpuProgress.style.setProperty("--progress-width", cpu + "%");

    // Bandwidth Usage (random 2.5-9.8 GB)
    const bandwidth = (Math.random() * 7.3 + 2.5).toFixed(1);
    bandwidthValue.textContent = bandwidth + " GB";
    bandwidthProgress.style.setProperty("--progress-width", (parseFloat(bandwidth) / 10 * 100) + "%");

    // Latency (random 3-25 ms)
    const latency = Math.floor(Math.random() * 22) + 3;
    latencyValue.textContent = latency + " ms";

    // Network Status
    if (cpu > 85 || packets > 80) {
      statusValue.textContent = "WARNING";
      statusValue.style.color = "#ff8c00";
    } else if (cpu > 60 || packets > 65) {
      statusValue.textContent = "ACTIVE";
      statusValue.style.color = "var(--accent-blue)";
    } else {
      statusValue.textContent = "ONLINE";
      statusValue.style.color = "var(--accent-green)";
    }
  }, 2000);

  // Initial values
  const devices = Math.floor(Math.random() * 8) + 8;
  const packets = Math.floor(Math.random() * 65) + 20;
  const cpu = Math.floor(Math.random() * 45) + 15;
  const bandwidth = (Math.random() * 7.3 + 2.5).toFixed(1);
  const latency = Math.floor(Math.random() * 22) + 3;

  devicesValue.textContent = devices;
  packetValue.textContent = packets + " Mbps";
  cpuValue.textContent = cpu + "%";
  bandwidthValue.textContent = bandwidth + " GB";
  latencyValue.textContent = latency + " ms";

  packetProgress.style.setProperty("--progress-width", packets + "%");
  cpuProgress.style.setProperty("--progress-width", cpu + "%");
  bandwidthProgress.style.setProperty("--progress-width", (parseFloat(bandwidth) / 10 * 100) + "%");
}
