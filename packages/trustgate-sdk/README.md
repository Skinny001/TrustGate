# @0xskinny001/trustgate-sdk

**Autonomous AI Agent Bouncer & Gatekeeper for Web APIs.**

Protect any API endpoint, autonomous service, or Model Context Protocol (MCP) server in 3 lines of code.

Features:
- **Concordium CIS-8004 Identity Verification**: Validates that the calling agent is backed by an accountable human or enterprise identity.
- **CIS-8 Cross-Chain Key Binding**: Confirms the caller holds the cryptographic private key (Base / EVM).
- **x402 Micro-Payments**: Enforces automated per-call tariffs (e.g. `0.002 CCD`) paid directly to your Concordium account.
- **EU AI Act Article 12 Compliance**: Generates verifiable audit records and cryptographic compliance certificates.

---

## Installation

```bash
npm install @0xskinny001/trustgate-sdk
```

---

## Quickstart (Next.js / Node.js)

Wrap your route handler in `withTrustGate`:

```typescript
// app/api/my-agent-service/route.ts
import { withTrustGate } from '@0xskinny001/trustgate-sdk';

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

---

## Standalone Identity & Payment Verification

```typescript
import { verifyAgentIdentity, verifyX402Payment } from '@0xskinny001/trustgate-sdk';

// Verify Concordium Badge
const identity = await verifyAgentIdentity({
  badge: "ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL",
  agentAddress: "0x372b4eB67006F68A9f296b23715055b8A878ABA9",
  signature: req.headers.get('x-agent-signature'),
  timestamp: req.headers.get('x-agent-timestamp')
});

if (!identity.allowed) {
  console.error("Rogue agent rejected:", identity.reason);
}
```

---

## License

MIT © [0xskinny001](https://github.com/Skinny001/TrustGate)
