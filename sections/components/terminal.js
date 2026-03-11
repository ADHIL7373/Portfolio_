function initTerminal() {
  const terminalBody  = document.getElementById("terminalBody");
  const terminalInput = document.getElementById("terminalInput");
  const promptLabel   = document.getElementById("terminalPromptLabel");

  if (!terminalInput) return;

  let privileged = false;

  function promptStr() { return privileged ? "ADHIL-R1#" : "ADHIL-R1>"; }

  function updatePromptLabel() {
    if (promptLabel) promptLabel.textContent = promptStr();
  }

  // Escape HTML to prevent XSS from user input
  function esc(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function addPromptLine(rawInput) {
    const div    = document.createElement("div");
    div.className = "terminal-line";
    const ps     = document.createElement("span");
    ps.className  = "terminal-prompt";
    ps.textContent = promptStr();
    div.appendChild(ps);
    div.appendChild(document.createTextNode(" " + rawInput));
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addOutput(text) {
    const div = document.createElement("div");
    div.className   = "terminal-line terminal-output";
    div.textContent = text;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addError(text) {
    const div = document.createElement("div");
    div.className   = "terminal-line terminal-error";
    div.textContent = text;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addBlank() {
    const div = document.createElement("div");
    div.className = "terminal-line";
    div.innerHTML = "&nbsp;";
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // ── Command output strings ────────────────────────────────────────────

  const USER_HELP =
`User EXEC Commands:
  enable               Enter Privileged EXEC Mode
  show version         Display device software & hardware info
  ping <ip/host>       Send ICMP echo packets
  traceroute <ip>      Trace route to destination
  ?                    This help message
  exit                 Exit EXEC session`;

  const PRIV_HELP =
`Privileged EXEC Commands:
  show ip route          Display routing table (OSPF / BGP / Static)
  show interfaces        Interface status & traffic statistics
  show ip ospf neighbor  OSPF neighbor adjacency table
  show ip bgp summary    BGP peer session summary
  show vlan brief        VLAN database & port assignments
  show running-config    Active device configuration
  show version           Device info & Cisco IOS version
  ping <ip/host>         ICMP connectivity test
  traceroute <ip>        Path trace utility
  write memory           Save running-config to NVRAM
  about                  Network Engineer profile
  disable                Return to User EXEC Mode
  clear                  Clear terminal screen`;

  const SHOW_VERSION =
`Cisco IOS Software, Version 15.9(3)M2, RELEASE SOFTWARE
Technical Support: http://www.cisco.com/techsupport

Hostname        : ADHIL-R1
Model           : Cisco 2911
Serial Number   : FTX1234A0001
IOS Version     : 15.9(3)M2
Uptime          : 14 days, 6 hours, 22 minutes
Processor       : MPC860P (revision 0x203)
Main Memory     : 512MB DRAM / 256MB Flash
NVRAM           : 128KB
Interfaces      : 3 GigabitEthernet, 2 Serial
License         : ipbase`;

  const SHOW_IP_ROUTE =
`Codes: L-local  C-connected  S-static  O-OSPF  B-BGP  R-RIP

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
O        10.10.1.0/24 [110/2]  via 192.168.1.2,  00:14:22, Gi0/0
O        10.10.2.0/24 [110/3]  via 192.168.1.2,  00:14:22, Gi0/0
      192.168.1.0/24 is variably subnetted, 2 subnets
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0
      192.168.2.0/24 is variably subnetted, 2 subnets
C        192.168.2.0/24 is directly connected, GigabitEthernet0/1
L        192.168.2.1/32 is directly connected, GigabitEthernet0/1
S*    0.0.0.0/0 [1/0] via 203.0.113.1`;

  const SHOW_INTERFACES =
`GigabitEthernet0/0 is up, line protocol is up
  Descr : ### UPLINK-TO-SWITCH-1 ###
  Hardware: CN Gigabit Ethernet, address: aabb.cc00.1000
  Internet address: 192.168.1.1/24
  MTU 1500 bytes  BW 1000000 Kbit/sec  DLY 10 usec
  Full-duplex, 1000Mb/s, media type RJ45
  Input : 24000 bits/sec, 18 packets/sec
  Output: 18000 bits/sec, 12 packets/sec

GigabitEthernet0/1 is up, line protocol is up
  Descr : ### UPLINK-TO-SWITCH-2 ###
  Hardware: CN Gigabit Ethernet, address: aabb.cc00.1001
  Internet address: 192.168.2.1/24
  MTU 1500 bytes  BW 1000000 Kbit/sec  DLY 10 usec
  Full-duplex, 1000Mb/s, media type RJ45
  Input :  9600 bits/sec,  8 packets/sec
  Output:  6400 bits/sec,  5 packets/sec

GigabitEthernet0/2 is administratively down, line protocol is down`;

  const SHOW_OSPF_NEIGHBOR =
`OSPF Process 1, Router ID 1.1.1.1

Neighbor ID     Pri   State       Dead Time   Address         Interface
192.168.1.2       1   FULL/BDR    00:00:36    192.168.1.2     Gi0/0
192.168.2.2       1   FULL/DR     00:00:38    192.168.2.2     Gi0/1

Total neighbor count: 2  |  Full adjacencies: 2`;

  const SHOW_BGP_SUMMARY =
`BGP router identifier 1.1.1.1, local AS 65001
BGP table version: 14

Neighbor        V    AS    MsgRcvd  MsgSent  Up/Down    State/PfxRcd
203.0.113.1     4   3356     1428     1390   14:22:18   Established / 12
10.10.0.2       4  65002      892      875   09:11:42   Established /  8`;

  const SHOW_VLAN_BRIEF =
`VLAN  Name                 Status    Ports
----  -------------------  --------  -----------------------------------
1     default              active    Gi0/2, Gi0/3
10    MANAGEMENT           active    Gi1/0, Gi1/1
20    ENGINEERING          active    Gi1/2, Gi1/3
30    SERVERS              active    Gi2/0
99    NATIVE               active
1002  fddi-default         act/unsup
1003  token-ring-default   act/unsup`;

  const SHOW_RUNNING_CONFIG =
`Building configuration...

Current configuration : 1842 bytes
!
version 15.9
hostname ADHIL-R1
!
interface GigabitEthernet0/0
 description ### UPLINK-TO-SWITCH-1 ###
 ip address 192.168.1.1 255.255.255.0
 ip ospf 1 area 0
 duplex full
 speed 1000
 no shutdown
!
interface GigabitEthernet0/1
 description ### UPLINK-TO-SWITCH-2 ###
 ip address 192.168.2.1 255.255.255.0
 ip ospf 1 area 0
 no shutdown
!
router ospf 1
 router-id 1.1.1.1
 network 192.168.0.0 0.0.255.255 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/0
 no passive-interface GigabitEthernet0/1
!
ip access-list extended BLOCK-TELNET
 deny tcp any any eq 23 log
 permit ip any any
!
ip route 0.0.0.0 0.0.0.0 203.0.113.1
!
end`;

  const ABOUT =
`Mohamed Adhil — Network Engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Degree    : B.Tech Information Technology (Final Year)
College   : Sri Eshwar College of Engineering (SECE)
Expertise : Cisco Routing & Switching, OSPF, BGP, VLANs,
            TCP/IP, Subnetting, ACLs, Firewall, STP, RSTP
Pursuing  : CCNA Certification
LinkedIn  : linkedin.com/in/a-mohamed-adhil
GitHub    : github.com/ADHIL7373`;

  // ── Command processor ─────────────────────────────────────────────────
  function processCommand(raw) {
    const cmd = raw.trim();
    if (cmd === "") return;

    const lower = cmd.toLowerCase();
    addPromptLine(cmd);

    if (lower === "clear") {
      terminalBody.innerHTML = "";
      return;
    }

    if (!privileged) {
      // ── User EXEC ─────────────────────────────────────────────────────
      if (lower === "enable") {
        privileged = true;
        updatePromptLabel();
        addBlank();
        addOutput("Entering Privileged EXEC Mode...");
        addBlank();
        return;
      }
      if (lower === "?" || lower === "help") { addOutput(USER_HELP); return; }
      if (lower === "show version")          { addOutput(SHOW_VERSION); return; }
      if (lower === "exit")                  { addOutput("Closed."); return; }

      if (lower.startsWith("ping")) {
        const target = cmd.split(" ").slice(1).join(" ") || "192.168.1.1";
        addOutput(
`Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to ${target}, timeout 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/3/6 ms`
        ); return;
      }
      if (lower.startsWith("traceroute") || lower.startsWith("tracert")) {
        const target = cmd.split(" ").slice(1).join(" ") || "8.8.8.8";
        addOutput(
`Tracing route to ${target}, 30 hops max:
  1   192.168.1.1     1 ms   1 ms   1 ms
  2   203.0.113.1     5 ms   4 ms   5 ms
  3   ${target}      21 ms  20 ms  22 ms
Trace complete.`
        ); return;
      }

      addError(`% Invalid input detected: '${cmd}'`);
      addError("  Type '?' for available User EXEC commands.");
    } else {
      // ── Privileged EXEC ───────────────────────────────────────────────
      if (lower === "disable") {
        privileged = false;
        updatePromptLabel();
        addBlank();
        return;
      }
      if (lower === "exit")                    { addOutput("Closed."); return; }
      if (lower === "?" || lower === "help")   { addOutput(PRIV_HELP); return; }
      if (lower === "show ip route")           { addOutput(SHOW_IP_ROUTE); return; }
      if (lower === "show interfaces")         { addOutput(SHOW_INTERFACES); return; }
      if (lower === "show ip ospf neighbor")   { addOutput(SHOW_OSPF_NEIGHBOR); return; }
      if (lower === "show ip bgp summary")     { addOutput(SHOW_BGP_SUMMARY); return; }
      if (lower === "show vlan brief")         { addOutput(SHOW_VLAN_BRIEF); return; }
      if (lower === "show running-config")     { addOutput(SHOW_RUNNING_CONFIG); return; }
      if (lower === "show version")            { addOutput(SHOW_VERSION); return; }
      if (lower === "write memory")            { addOutput("Building configuration...\n[OK]\nConfiguration successfully saved to NVRAM."); return; }
      if (lower === "about" || lower === "whoami") { addOutput(ABOUT); return; }

      if (lower.startsWith("ping")) {
        const target = cmd.split(" ").slice(1).join(" ") || "192.168.1.1";
        addOutput(
`Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to ${target}, timeout 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/3/6 ms`
        ); return;
      }
      if (lower.startsWith("traceroute") || lower.startsWith("tracert")) {
        const target = cmd.split(" ").slice(1).join(" ") || "8.8.8.8";
        addOutput(
`Tracing route to ${target}, 30 hops max:
  1   192.168.1.1     1 ms   1 ms   1 ms
  2   203.0.113.1     5 ms   4 ms   5 ms
  3   ${target}      21 ms  20 ms  22 ms
Trace complete.`
        ); return;
      }
      if (lower.startsWith("configure terminal") || lower === "conf t") {
        addError("% Configuration mode not available in portfolio simulation.");
        addError("  Use 'show running-config' to view the active config.");
        return;
      }

      addError(`% Invalid input detected: '${cmd}'`);
      addError("  Type '?' for available Privileged EXEC commands.");
    }
  }

  terminalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processCommand(terminalInput.value);
      terminalInput.value = "";
    }
  });

  terminalInput.focus({ preventScroll: true });
}


  if (!terminalInput) return;

  const commands = {
    help: `Help - Available Commands:
  help              - Show this help message
  whoami            - Display current user
  skills            - List technical skills
  network-skills    - List networking expertise
  ping google.com   - Ping Google DNS
  traceroute        - Trace route to network.local
  clear             - Clear terminal
  about             - About Mohamed Adhil`,

    whoami: `adhil@network
user: adhil
hostname: NETWORK-ENGINEER
os: Dashboard-Linux
role: Network Engineer & Developer`,

    skills: `Technical Skills:
  ✓ HTML & CSS
  ✓ JavaScript
  ✓ Java Programming
  ✓ Git & GitHub
  ✓ Web Development
  ✓ Problem Solving`,

    "network-skills": `Networking Skills:
  ✓ Routing (OSPF, BGP, RIP)
  ✓ Switching (VLANs, STP)
  ✓ Subnetting & IPv4
  ✓ Network Security (Firewalls, ACLs)
  ✓ TCP/IP Protocol Stack
  ✓ CCNA Preparation (Learning)`,

    "ping google.com": `PING google.com (142.250.183.14) 56(84) bytes of data.
64 bytes from 142.250.183.14: icmp_seq=1 time=20ms TTL=115
64 bytes from 142.250.183.14: icmp_seq=2 time=21ms TTL=115
64 bytes from 142.250.183.14: icmp_seq=3 time=19ms TTL=115

--- google.com statistics ---
3 packets transmitted, 3 received, 0% packet loss`,

    traceroute: `traceroute to network.local (192.168.1.1), 30 hops max
  1   router.local (192.168.1.1)     2ms
  2   gateway.network (10.0.0.1)     5ms
  3   switch.core (10.0.0.5)         8ms
  4   server.local (10.0.0.100)      12ms
  
Connection established successfully!`,

    about: `Mohamed Adhil - Network Engineer Portfolio
B.Tech IT Student | Network Enthusiast | Developer
Passionate about networking infrastructure and routing technologies
Specialized in: Switching, Routing, Network Security
Currently: Learning CCNA & Advanced Networking Concepts`,

    clear: null
  };

  function addLine(text, isError = false) {
    if (!terminalBody) return;
    const line = document.createElement("div");
    line.className = "terminal-line";
    if (isError) line.classList.add("terminal-error");
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function processCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    
    if (cmd === "") return;

    // Display command
    addLine(`<span class="terminal-prompt">adhil@network:~$</span> ${cmd}`);

    if (cmd === "clear") {
      terminalBody.innerHTML = "";
      return;
    }

    if (commands[cmd]) {
      addLine(commands[cmd]);
    } else {
      addLine(`<span class="terminal-error">Command not found: ${cmd}</span>`, true);
      addLine(`<span class="terminal-error">Type 'help' for available commands</span>`, true);
    }
  }

  terminalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processCommand(terminalInput.value);
      terminalInput.value = "";
    }
  });

  // Auto-focus input without scrolling to it
  terminalInput.focus({ preventScroll: true });
