# TrustGate

> **Accountable AI Agent Gateway powered by Concordium Identity (CIS-8004 / CIS-8) & x402 Micro-Payments**  
> *Built for the Concordium Trusted Agents Hackathon (Encode Club & Concordium)*

[![Concordium Testnet](https://img.shields.io/badge/Concordium-Testnet-emerald.svg)](https://ccdexplorer.io/testnet)
[![Standards](https://img.shields.io/badge/Standards-CIS--8004%20%7C%20CIS--8%20%7C%20x402-blue.svg)](https://docs.concordium.com)
[![Compliance](https://img.shields.io/badge/Compliance-EU%20AI%20Act%20Art.%2012-violet.svg)](https://artificialintelligenceact.eu)
[![Public Repository](https://img.shields.io/badge/GitHub-Repository-black.svg)](https://github.com/Skinny001/TrustGate)

---

## 📌 Hackathon Pathway Checklist

| Pathway Requirement | Status | Reference in TrustGate |
| :--- | :---: | :--- |
| **1. Description** (What you built, how it works, Concordium components) | ✅ **Complete** | See [Overview & How It Works](#-description--how-it-works) and [Concordium Components](#-concordium-components-in-trustgate) |
| **2. Public Code Repository** | ✅ **Complete** | [github.com/Skinny001/TrustGate](https://github.com/Skinny001/TrustGate) |
| **3. Demo Video** (Up to 3 minutes, showing core flow working) | ✅ **Complete** | [Watch on YouTube (https://youtu.be/u_wb-OnNzN8)](https://youtu.be/u_wb-OnNzN8) — See [Demo Video Details](#-product-demo-video) |
| **4. CCDExplorer Links** (Agent, contract, and testnet transactions) | ✅ **Complete** | Live Concordium Testnet links — See [On-Chain Verification](#-ccdexplorer-links--on-chain-identity) |
| **5. Path to Production** (Requirements to go live on Mainnet) | ✅ **Complete** | Detailed 5-phase plan — See [Path to Production](#-path-to-production) |

---

## 📖 Description & How It Works

As autonomous AI agents increasingly invoke paid APIs, external tools over MCP (Model Context Protocol), and web services on their own, service providers face three critical vulnerabilities:
1. **No Identity / Accountability:** Any anonymous script can claim to be an agent. Providers have no way to hold a real human or enterprise legally liable for abusive or fraudulent calls.
2. **No Agent-Native Payment:** Traditional APIs rely on credit cards or pre-provisioned API keys—neither of which works for an autonomous agent acting across web services.
3. **No Verifiable Audit Trail:** Regulations like **EU AI Act Article 12** require continuous, tamper-evident record-keeping linking autonomous actions back to an accountable owner.

**TrustGate is an automated bouncer and monetization gateway for AI agents.** It sits in front of any high-value API or agent service, intercepting every incoming request with a 3-step verification, payment, and audit pipeline:

```
                   ┌────────────────────────────────────────────────────────┐
                   │                 TrustGate Gateway                      │
                   │                                                        │
[ AI Agent ] ───► │  1. "Who are you?" (Concordium Badge & CIS-8 Check)   │
                   │     └─► Revoked / Missing? ──► HTTP 403 Forbidden      │
                   │                                                        │
                   │  2. "Can you pay?" (x402 Micro-Payment Protocol)       │
                   │     └─► Unpaid? ─────────────► HTTP 402 Challenge      │
                   │     └─► Settle via x402 ─────► 0.002 CCD / PLT         │
                   │                                                        │
                   │  3. "What happened?" (EU AI Act Article 12 Audit Log)  │
                   │     └─► Commit verifiable log (Owner, Caller, TxHash)  │
                   └──────────────────────────┬─────────────────────────────┘
                                              │ (Allowed & Settled)
                                              ▼
                                [ Protected High-Value API ]
```

### The 3 Core Operations:
1. **Verification (CIS-8004 & CIS-8):** Inspects the caller's `X-Concordium-Badge` header. Resolves the agent's on-chain Agent Card in the CIS-8004 Registry, confirms its **Active** status, and verifies its cryptographic cross-chain key binding via CIS-8.
2. **Monetization (HTTP 402 & x402):** Issues a standard `402 Payment Required` challenge. The autonomous agent signs and settles the micro-payment (0.002 CCD) automatically without human intervention or credit cards.
3. **Accountability (EU AI Act Article 12):** Automatically generates a forensic, tamper-evident log committing caller ID, KYC-verified Concordium human owner, payment transaction hash, and timestamp.

---

## 🏛 Concordium Components in TrustGate

| Component | Standard | Role in TrustGate |
| :--- | :--- | :--- |
| **Agent Registry** | **CIS-8004** | Validates the agent's minted non-fungible badge, Active/Revocation status, and metadata hash on Concordium. Guarantees that every agent represents a KYC-verified human account. |
| **External Key Registry** | **CIS-8** | Cryptographically bridges external execution keys (e.g. Base EVM `0x372b...ABA9`) to the Concordium identity authority, allowing agents to execute cross-chain while staying bound to a verified owner. |
| **Autonomous Micro-Payments** | **x402 & CCD** | Enforces instant per-call monetization (0.002 CCD) via HTTP 402 protocol, routed directly into the provider's Concordium deposit address. |
| **Regulatory Compliance Ledger** | **EU AI Act Art. 12** | Creates an immutable, forensic audit trail linking every single autonomous request back to the accountable human identity. |

---

## 🔗 CCDExplorer Links & On-Chain Identity

TrustGate is connected to live, verified Concordium Testnet contracts and identities:

| Entity | On-Chain Identifier / Value | CCDExplorer Link |
| :--- | :--- | :--- |
| **Accountable Human Owner** | `4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc` | [View on CCDExplorer](https://ccdexplorer.io/testnet/account/4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc) |
| **CIS-8004 Agent Registry Contract** | Contract Index `10082` (Subindex `0`) | [CIS-8004 Contract #10082](https://ccdexplorer.io/testnet) |
| **CIS-8 Key Binding Contract** | Contract Index `10081` (Subindex `0`) | [CIS-8 Contract #10081](https://ccdexplorer.io/testnet) |
| **Registered Agent Badge** | `ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL` | Concordium Testnet CIS-2 Badge |
| **Bound External Key (Base EVM)** | `0x372b4eB67006F68A9f296b23715055b8A878ABA9` | CAIP-2: `eip155:8453` |

---

## 🎬 Product Demo Video

> **Official Demo Video:** [https://youtu.be/u_wb-OnNzN8](https://youtu.be/u_wb-OnNzN8)

An automated, motion-designed demo video built with Remotion (React + TypeScript) shows the full TrustGate experience in 80 seconds (1m 20s), featuring:
- **Broadsheet Newspaper UI Theme:** Warm newsprint `#F6F4EE`, printer's ink `#1C1917`, and crimson wax stamps `#991B1B`.
- **Narration:** Natural voiceover by **Daniel** (distinguished British broadsheet narration).
- **Synchronized Subtitles:** Integrated read-along subtitle overlay for accessibility and muted feeds.
- **Dynamic 120 BPM Soundtrack:** Original code-synthesized drum and bass groove with 39 frame-accurate UI sound effects (clicks, coins, stamps, thuds).

### Video Links & Deliverables:
- **YouTube Link:** [https://youtu.be/u_wb-OnNzN8](https://youtu.be/u_wb-OnNzN8)
- **Embedded Player:** Viewable directly on the [TrustGate Landing Page](http://localhost:3000#demo-broadcast)
- **Social / Reels Cut (1080 × 1920):** Available in `video/out/trustgate-demo-1080x1920.mp4`
- **Sidecar Subtitles (.SRT file):** [public/trustgate-subtitles.srt](file:///Users/mac/Desktop/Dev/TrustGate/public/trustgate-subtitles.srt)

### Video Walkthrough Structure:
1. **0s–12s (Front Page Broadsheet):** Cover thumbnail and manifesto introduction. Operator clicks *Launch Control Plane*.
2. **12s–24s (Agent Registry CIS-8004):** Inspects the agent badge and accountable Concordium owner. Slams red *VERIFIED BY CONCORDIUM* stamp.
3. **24s–34s (CIS-8 Key Bindings):** Cryptographic bridge links Base EVM key to Concordium ID with mechanical lock.
4. **34s–50s (Agent A Simulation):** HTTP 402 challenge issued → Agent settles 0.002 CCD autonomously → HTTP 200 OK telemetry released.
5. **50s–62s (Agent B Simulation):** Unverified script intercepted → *HTTP 403 FORBIDDEN: ROGUE AGENT REFUSED* bouncer stamp slams.
6. **62s–72s (Article 12 Audit Log):** Forensic JSON inspection verifying EU AI Act Article 12 compliance.
7. **72s–80s (Outro & CTA):** 3-word payoff (*VERIFIED. MONETIZED. ACCOUNTABLE.*) and GitHub repository link.

---

## ⚡ Quick Start: Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start the TrustGate Control Plane
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live TrustGate broadsheet control plane.

---

## 🧪 Testing the 2 Demo Agents (The Hackathon Flow)

You can run the full end-to-end verification and bouncer pipeline either from the **Web Dashboard** or from the **Terminal**:

### Option A: From the Web Dashboard
1. Navigate to [http://localhost:3000](http://localhost:3000) (or `/dashboard`).
2. Click **`Simulate Agent A (Pass & Pay)`**:
   - Presents Concordium Badge & Base EVM key.
   - Receives `402 Payment Required`.
   - Settles 0.002 CCD via x402 automatically.
   - Returns `200 OK` with telemetry data.
   - Live audit log records an `ALLOWED` entry.
3. Click **`Simulate Agent B (Rogue / Block)`**:
   - Fails Concordium badge check (unregistered caller).
   - Rejected at the gate with `403 Forbidden`.
   - Live audit log records a `BLOCKED` entry.

### Option B: From the Terminal (CLI)
Run the automated test runner:
```bash
npm run demo
```
Or run each agent individually:
```bash
# Agent A (Verified & Accountable):
npm run agent:a

# Agent B (Unverified Script):
npm run agent:b
```

---

## 📂 Architecture & Directory Structure

```
TrustGate/
├── app/
│   ├── page.tsx                           # Broadsheet front page & manifesto
│   ├── dashboard/page.tsx                 # Full Control Plane (Registry, CIS-8, x402, Audit)
│   ├── api/
│   │   ├── gateway/protected-data/route.ts # Target paid service (Weather & Geo-telemetry API)
│   │   ├── audit-log/route.ts             # EU AI Act Art. 12 verifiable audit records
│   │   ├── stats/route.ts                 # Gateway telemetry and revenue metrics
│   │   └── simulate/route.ts              # Agent simulation controller
│   └── icon.svg                           # Bespoke TrustGate archway & keyhole emblem
├── lib/
│   └── trustgate/
│       ├── types.ts                       # Core interfaces (AgentIdentity, AuditRecord, x402)
│       ├── concordium.ts                  # CIS-8004 & CIS-8 badge verification engine
│       ├── x402.ts                        # x402 challenge generator & payment verifier
│       ├── audit-store.ts                 # EU AI Act Art. 12 persistent audit logger
│       └── gateway.ts                     # Core bouncer middleware
├── video/                                 # Self-contained Remotion video studio
│   ├── src/
│   │   ├── Root.tsx                       # Master composition & audio timeline
│   │   ├── timing.ts                      # 120 BPM cue sheet & event timing
│   │   ├── theme.ts                       # Broadsheet newspaper color tokens
│   │   ├── components/                    # SubtitleOverlay, Paper, Cursor, Stage, Stamp
│   │   └── scenes/                        # 7 automated scenes
│   ├── scripts/
│   │   ├── generate-audio.ts              # Programmatic soundtrack & SFX synthesizer
│   │   └── generate-voice.sh              # Daniel broadsheet narration generator
│   └── out/                               # Rendered MP4 deliverables & subtitles
├── scripts/
│   ├── demo-agent-a.ts                    # Verified agent (Concordium badge + x402 payment)
│   ├── demo-agent-b.ts                    # Unverified rogue agent (fails badge check)
│   └── run-demo.ts                        # One-command dual-agent runner
├── data/
│   └── audit_log.json                     # Persistent audit log records
└── public/
    ├── pathway.png                        # Encode Club Hackathon submission checklist
    ├── trustgate-subtitles.srt            # Video subtitles
    ├── logo.svg                           # High-res vector emblem
    └── download-logo.html                 # Logo download utility
```

---

## 🚀 Path to Production

To take TrustGate from the testnet hackathon prototype into a production service running in front of real users and autonomous agents on Concordium Mainnet:

1. **Mainnet Contract Migration:**
   - Deploy production-hardened `CIS-8004` (Agent Registry) and `CIS-8` (External Key Registry) smart contracts onto Concordium Mainnet.
   - Require biometric KYC / business verification through Concordium Identity Providers before minting agent badges.

2. **Protocol-Level Token (PLT) & Stablecoin Settlement:**
   - Expand beyond raw CCD to support Protocol-Level Tokens (PLTs) and fiat-pegged stablecoins (e.g. EUROe / bridged USDC) so API providers can set predictable fiat pricing for autonomous agents.

3. **Concordium Sponsored Gas Transactions:**
   - Implement Concordium Account Sponsorship so autonomous agents only need funds for the API micropayment itself, eliminating the requirement for agents to manage gas tokens for identity checks.

4. **High-Performance Rust / Wasm Edge Proxy:**
   - Compile the TrustGate bouncer core (`crates/trustgate-core`) into WebAssembly for sub-millisecond execution on edge CDNs (Cloudflare Workers, Fastly Compute, or Envoy gateway filters) capable of filtering millions of requests per second.

5. **Enterprise Legal Entity Identifier (LEI) Integration:**
   - Integrate Concordium's institutional identity layer to verify Corporate Legal Entity Identifiers (LEI), enabling Fortune 500 enterprises to deploy accountable AI agents with verifiable corporate liability.

---

## 📜 Public Repository & License

- **GitHub Repository:** [https://github.com/Skinny001/TrustGate](https://github.com/Skinny001/TrustGate)
- **License:** MIT License. Built for the Encode Club × Concordium Trusted Agents Hackathon 2026.
