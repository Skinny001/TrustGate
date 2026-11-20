import { NextRequest, NextResponse } from 'next/server';
import { verifyAgentIdentity } from './concordium';
import { createX402Challenge, verifyX402Payment } from './x402';
import { addAuditRecord } from './audit-store';

export interface GatewayHandlerContext {
  agentIdentity?: import('./types').AgentIdentity;
  paymentProof?: import('./types').X402PaymentProof;
}

/**
 * TrustGate Core Middleware Engine
 * Enforces Concordium Identity -> x402 Payment -> Audit Logging -> Upstream API
 */
export async function withTrustGate(
  req: NextRequest,
  downstreamHandler: (context: GatewayHandlerContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const badge = req.headers.get('x-concordium-badge') || undefined;
  const agentAddress = req.headers.get('x-agent-address') || undefined;
  const signature = req.headers.get('x-agent-signature') || undefined;
  const timestamp = req.headers.get('x-agent-timestamp') || undefined;
  const agentId = req.headers.get('x-agent-id') || badge || 'anonymous-caller';
  const endpoint = req.nextUrl.pathname;
  const method = req.method;

  // 1. Identity Check: "Who are you?"
  const identityResult = await verifyAgentIdentity({
    badge,
    agentAddress,
    signature,
    timestamp,
  });

  if (!identityResult.allowed || !identityResult.identity) {
    // Log blocked attempt in audit store (Article 12 compliance)
    addAuditRecord({
      endpoint,
      method,
      agentId,
      concordiumOwner: 'UNVERIFIED',
      decision: 'BLOCKED',
      statusCode: 403,
      reason: identityResult.reason,
      riskScore: identityResult.riskScore,
    });

    return NextResponse.json(
      {
        error: 'Forbidden',
        reason: identityResult.reason,
        trustGateNotice: 'Access denied: Requires verified human-backed Concordium agent badge (CIS-8004)',
      },
      {
        status: 403,
        headers: {
          'X-TrustGate-Decision': 'BLOCKED',
          'X-TrustGate-Reason': identityResult.reason,
        },
      }
    );
  }

  const identity = identityResult.identity;

  // 2. Payment Check: "Can you pay?" (x402)
  const paymentResult = await verifyX402Payment(req.headers);

  if (!paymentResult.settled || !paymentResult.paymentProof) {
    // Return standard HTTP 402 challenge
    const challenge = createX402Challenge();

    return NextResponse.json(challenge, {
      status: 402,
      headers: {
        'WWW-Authenticate': `x402 realm="TrustGate", network="${challenge.network}", token="${challenge.currency}", price="${challenge.price}", recipient="${challenge.recipient}"`,
        'X-TrustGate-Decision': 'PAYMENT_REQUIRED',
        'X-TrustGate-Agent-Verified': 'true',
        'X-TrustGate-Owner': identity.concordiumAccount,
      },
    });
  }

  const payment = paymentResult.paymentProof;

  // 3. What happened? Log the successful transaction in the verifiable audit trail
  const auditEntry = addAuditRecord({
    endpoint,
    method,
    agentId: identity.name || identity.badge,
    concordiumOwner: identity.concordiumAccount,
    externalKey: identity.externalKey,
    decision: 'ALLOWED',
    statusCode: 200,
    reason: 'Verified by Concordium (CIS-8004) & x402 payment settled',
    payment: {
      txHash: payment.txHash,
      amount: payment.amount,
      currency: payment.currency,
      settled: true,
    },
    riskScore: identityResult.riskScore,
  });

  // 4. Serve the upstream response with TrustGate proof headers
  const response = await downstreamHandler({
    agentIdentity: identity,
    paymentProof: payment,
  });

  response.headers.set('X-TrustGate-Decision', 'ALLOWED');
  response.headers.set('X-TrustGate-Audit-Id', auditEntry.id);
  response.headers.set('X-TrustGate-Owner', identity.concordiumAccount);
  response.headers.set('X-TrustGate-Payment-Tx', payment.txHash);

  return response;
}
