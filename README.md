# Mohamed Adhil — Network Engineer Portfolio

> A premium, interactive portfolio built to showcase networking expertise, technical skills, and live simulations — designed to impress recruiters at a glance.

---

## 🌐 Live Preview

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Using VS Code Live Server extension (recommended)
Right-click index.html → Open with Live Server

# Using Python
python -m http.server 5500

# Using Node.js
npx serve .
```

---

## 📸 Sections

| Section | Description |
|---|---|
| **Hero** | Full-screen intro with profile image, role title, and resume download / contact CTAs |
| **About / Qualifications** | Education timeline — SSLC → Diploma → B.Tech IT |
| **Skills** | Technical skills (HTML/CSS, JS, Java, Git) + Networking skills (Routing, Switching, VLAN, Subnetting, TCP/IP, Firewalls, Network Security, CCNA) with proficiency levels |
| **Certificates** | Gallery of professional certifications and achievements |
| **Live Network Traffic** | Animated network nodes with glowing packet flow between random nodes |
| **Router Data Transmission Simulation** | Full SVG topology (1 Router → 2 Switches → 6 Clients) with real-time animated packet routing, live stats panel (Packets Sent / Received / In Transit) |
| **Network Dashboard** | Live monitoring cards — Network Status, Connected Devices, Packet Flow Rate, CPU Load, Bandwidth Usage, Network Latency — all updating in real time |
| **Footer / Contact** | Social links (LinkedIn, GitHub, Twitter/X, Email) and direct contact details |

---

## ✨ Features

### 🎨 Design
- **Dark / Light mode toggle** — persisted via `localStorage`, no flash on page load
- **Glassmorphism UI** — backdrop blur, translucent panels, neon glow borders
- **Neon colour palette** — Accent Blue `#00d4ff`, Accent Green `#00ff88`, Accent Purple `#7c3aed`
- **Responsive layout** — Desktop → Tablet → Mobile (480 / 768 / 1200px breakpoints)

### 🌐 Network Simulations
- **Live Network Traffic** — 10 nodes with pulsing animations, packets spawn every 700–900 ms
- **Router Simulation** — SVG-based topology; packets travel `Client → Switch → Router → Switch → Client` along real path segments using `requestAnimationFrame` with ease-in-out physics; router glows cyan on forward, lines light up as packets traverse them
- **Network Dashboard** — 6 live metric cards with animated progress bars, pulsing status dots, values randomised every 2 seconds

### ⚡ Interactions
- **Binary rain cursor effect** — green `0`s and `1`s float upward from the cursor when hovering over simulations; burst of 8 bits on mouse-enter
- **Scroll animations** — `IntersectionObserver` fade-in-up for all cards and containers
- **Smooth navigation** — sticky navbar with smooth scroll and hash-free URL (no scroll-on-refresh)

---

## 🗂️ Project Structure

```
portfolio/
├── index.html                        # Entry point — section loader, theme toggle
├── style.css                         # Full design system + all component styles
├── .gitignore
├── README.md
└── sections/
    ├── hero.html                     # Hero / intro section
    ├── about.html                    # Qualifications & education
    ├── skills.html                   # Technical + networking skills
    ├── projects.html                 # Certificates gallery
    ├── network.html                  # Live network traffic simulation
    ├── router-sim.html               # Router data transmission simulation (SVG)
    ├── dashboard.html                # Network monitoring dashboard
    ├── assets/
    │   ├── images/                   # Profile photo, certificate images
    │   └── Resume.pdf                # Downloadable CV
    └── components/
        ├── navbar.js                 # Dynamic navbar injection + smooth scroll
        ├── animations.js             # IntersectionObserver scroll reveal
        ├── network.js                # Live network traffic packet engine
        ├── router-sim.js             # Router simulation animation engine
        ├── dashboard.js              # Dashboard live data updater
        └── binary-effect.js          # Binary rain cursor effect
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 — modular section files loaded via `fetch()` |
| Styling | CSS3 — custom properties, glassmorphism, keyframe animations |
| Scripting | Vanilla JavaScript — no frameworks, no dependencies |
| Animation | `requestAnimationFrame`, CSS `@keyframes`, `IntersectionObserver` |
| Graphics | Inline SVG (router simulation topology) |
| Persistence | `localStorage` (theme preference) |

> **Zero build step. Zero npm install. Zero dependencies.** Open and run.

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADHIL7373/<repo-name>.git
   cd <repo-name>
   ```

2. **Serve locally** (required — `fetch()` needs a server, not `file://`)
   ```bash
   # VS Code: install "Live Server" extension, then click "Go Live"
   # or:
   npx serve .
   ```

3. **Open** `http://127.0.0.1:5500/index.html`

---

## 🎨 Theming

The design system uses CSS custom properties defined in `:root` (dark) and `[data-theme="light"]`:

| Variable | Dark | Light |
|---|---|---|
| `--bg-primary` | `#0a0e27` | `#f5f7fa` |
| `--accent-blue` | `#00d4ff` | `#0066cc` |
| `--accent-green` | `#00ff88` | `#00aa44` |
| `--text-primary` | `#e0e6ff` | `#1a1a2e` |

Toggle is saved to `localStorage` and applied before first paint to prevent flash.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `> 1200px` | Full desktop — side-by-side panels, full SVG topology |
| `768px – 1200px` | Tablet — stacked panels, 2-column grids |
| `< 480px` | Mobile — single column, scaled nodes and typography |

---

## 📬 Contact

| Channel | Link |
|---|---|
| LinkedIn | [linkedin.com/in/a-mohamed-adhil](http://www.linkedin.com/in/a-mohamed-adhil) |
| GitHub | [github.com/ADHIL7373](https://github.com/ADHIL7373) |
| Twitter / X | [@adhil43608](https://x.com/adhil43608) |
| Email | mohamedadhil2024lit@sece.ac.in |
| Phone | +91 9789181440 |

---

## 📄 License

This portfolio is personal work. Feel free to use the design ideas as inspiration — just don't copy it as your own. 🙂

---

<div align="center">
  <strong>Built with ❤️ by Mohamed Adhil</strong><br/>
  Network Engineer · IT Student · Developer
</div>
