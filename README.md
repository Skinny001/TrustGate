# TrustGate

> **Accountable AI Agent Gateway powered by Concordium Identity (CIS-8004 / CIS-8) & x402 Micro-Payments**  
> *Built for the Concordium Trusted Agents Hackathon (Encode Club & Concordium)*

[![npm version](https://img.shields.io/npm/v/@0xskinny001/trustgate-sdk.svg?color=crimson)](https://www.npmjs.com/package/@0xskinny001/trustgate-sdk)
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
| **3. Demo Video** (Up to 3 minutes, showing core flow working) | ✅ **Complete** | [Watch on YouTube (https://youtu.be/_n1_fkSQEv0)](https://youtu.be/_n1_fkSQEv0) — See [Demo Video Details](#-product-demo-video) |
| **4. CCDExplorer Links** (Agent, contract, and testnet transactions) | ✅ **Complete** | Live Concordium Testnet links — See [On-Chain Verification](#-ccdexplorer-links--on-chain-identity) |
| **5. Path to Production** (Requirements to go live on Mainnet) | ✅ **Complete** | Detailed 5-phase plan — See [Path to Production](#-path-to-production) |
| **6. Official NPM Package** (Drop-in SDK for developers) | ✅ **Complete** | [`@0xskinny001/trustgate-sdk` on npm](https://www.npmjs.com/package/@0xskinny001/trustgate-sdk) — See [Developer SDK](#-official-developer-drop-in-sdk-0xskinny001trustgate-sdk) |

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

## 📦 Official Developer Drop-in SDK (`@0xskinny001/trustgate-sdk`)

TrustGate is distributed as an open-source, production-ready npm package: **[`@0xskinny001/trustgate-sdk`](https://www.npmjs.com/package/@0xskinny001/trustgate-sdk)**.

Any developer, web service provider, or Model Context Protocol (MCP) server can protect their endpoints with Concordium identity verification and x402 monetization in **3 lines of code**:

### 1. Install the SDK:
```bash
npm install @0xskinny001/trustgate-sdk
```

### 2. Wrap your API Handler (Next.js / Node.js):
```typescript
import { withTrustGate } from '@0xskinny001/trustgate-sdk';

// Wrap your route handler with the TrustGate automated bouncer
export const POST = withTrustGate(async (req, { agentIdentity, paymentProof }) => {
  return Response.json({
    status: "Success",
    message: "Protected intelligence released!",
    verifiedOwner: agentIdentity?.concordiumAccount,
    settledTx: paymentProof?.txHash
  });
}, {
  concordiumAccount: "4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc",
  tariff: "0.002 CCD",
  enforceArticle12: true
});
```

### 3. Model Context Protocol (MCP) Server:
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { wrapToolWithTrustGate } from "@0xskinny001/trustgate-sdk";

const server = new McpServer({ name: "WeatherAgent", version: "1.0.0" });

server.tool(
  "query_live_weather",
  wrapToolWithTrustGate({
    tariff: "0.002 CCD",
    concordiumAccount: "4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc",
    handler: async (args) => ({ temperature: "18.4C", status: "RELEASED" })
  })
);
```

---

## 🌟 Standout Enterprise Features

TrustGate includes four standout enterprise features accessible directly from the live control plane:

1. **Developer Drop-In SDK Drawer (Tab 6: `sdk`):**
   - 3-line drop-in code snippet drawer for **Next.js/TypeScript**, **Python/FastAPI**, **Model Context Protocol (MCP)**, and raw **cURL**.
   - Includes one-click copy buttons for terminal install commands and code blocks.

2. **EU AI Act Article 12 Compliance Certificate Downloader (Tab 5: `audit`):**
   - Forensic certificate generator downloading official `.json` compliance certificates containing statutory provisions (Regulation EU 2024/1689), Concordium CCDExplorer audit URLs, and SHA-256 payload integrity digests.
   - Includes a one-click **"Export Article 12 Ledger"** archive button.

3. **Live On-Chain Badge & Key Inspector (Tab 2: `registry`):**
   - Interactive live inspector with one-click test presets (*"Load Real Badge"*, *"Load Concordium Account"*, *"Test Unregistered Bot"*).
   - Validates CIS-8004 state, cross-chain Base EVM bindings, and risk scoring in real time.

4. **Interactive Wire Protocol Playground (Tab 1: `monitor`):**
   - Live wire inspector with interactive scenario toggles:
     - **Case A (200 OK)**: Verified agent with settled x402 payment.
     - **Case B (402 Payment Required)**: Autonomous micro-payment challenge issued.
     - **Case C (403 Forbidden)**: Unregistered rogue bot blocked at the gate.
   - Displays exact raw HTTP wire request and response headers.

---

## 🎬 Product Demo Video

> **Official Demo Video:** [https://youtu.be/_n1_fkSQEv0](https://youtu.be/_n1_fkSQEv0)

An automated, motion-designed demo video built with Remotion (React + TypeScript) demonstrates the full TrustGate experience in **2 minutes 42 seconds (162s)** — strictly adhering to the hackathon rule of up to 3 minutes:
- **Broadsheet Newspaper UI Theme:** Warm newsprint `#F6F4EE`, printer's ink `#1C1917`, and crimson wax stamps `#991B1B`.
- **Narration:** Natural voiceover by **Daniel** (distinguished British broadsheet narration).
- **Synchronized Subtitles:** Integrated read-along subtitle overlay for accessibility and muted feeds.
- **Dynamic 120 BPM Soundtrack:** Original code-synthesized drum and bass groove with 49 frame-accurate UI sound effects (clicks, coins, stamps, thuds, locks).

### Video Links & Deliverables:
- **YouTube Link:** [https://youtu.be/_n1_fkSQEv0](https://youtu.be/_n1_fkSQEv0)
- **Embedded Player:** Viewable directly on the [TrustGate Landing Page](http://localhost:3000#demo-broadcast)
- **Full 1080p Master:** Rendered at `video/out/trustgate-demo-1920x1080.mp4`
- **Sidecar Subtitles (.SRT file):** [public/trustgate-subtitles.srt](file:///Users/mac/Desktop/Dev/TrustGate/public/trustgate-subtitles.srt)

### Core Workflow Walkthrough Structure:
1. **00:00–00:18 (Front Page Broadsheet):** Broadsheet masthead, architectural pillars, and operator launching the control plane.
2. **00:18–00:38 (Live Monitor — Agent A):** Authorized agent requests telemetry → HTTP 402 challenge → 0.002 CCD settled autonomously → 200 OK data released.
3. **00:38–00:50 (Live Monitor — Agent B):** Unverified scraping bot intercepted → cold HTTP 403 Forbidden rejection.
4. **00:50–01:04 (Protocol Wire Playground):** Interactive raw HTTP header inspector for 200 OK, 402 Payment Required, and 403 Forbidden wire payloads.
5. **01:04–01:16 (Agent Registry CIS-8004):** CIS-8004 NFT agent identity badge bound to verified human owner.
6. **01:16–01:25 (CIS-8 Key Bindings):** Cryptographic cross-chain key binding linking Base EVM key to Concordium ID.
7. **01:25–01:39 (Live On-Chain Badge Inspector):** Real-time on-chain verification testing Real Badge (Risk 0/100) vs. Rogue Impostor (Risk 95/100).
8. **01:40–01:53 (Article 12 Audit Log):** Forensic regulatory ledger compliant with EU AI Act Article 12 non-repudiation obligations.
9. **01:54–02:09 (Statutory Decree Modal):** Official Article 12 compliance certificate with legal seal, SHA-256 hashes, and exportable PDF printout.
10. **02:10–02:29 (Developer SDK Drop-In):** Official `@0xskinny001/trustgate-sdk` npm package installation & 3-line Next.js / MCP server integration.
11. **02:30–02:42 (Conclusion & CTA):** *Verified. Monetized. Accountable.* + CCDScan Testnet explorer and GitHub links.

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
├── packages/
│   └── trustgate-sdk/                     # Official @0xskinny001/trustgate-sdk npm package
│       ├── src/                           # TypeScript source (gateway, concordium, x402)
│       ├── dist/                          # Compiled CommonJS (.js) and ESM (.mjs) with types (.d.ts)
│       ├── package.json                   # Standalone npm package manifest
│       └── README.md                      # SDK documentation
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
