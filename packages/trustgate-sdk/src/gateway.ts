import { verifyAgentIdentity } from './concordium.js';
import { createX402Challenge, verifyX402Payment } from './x402.js';
import { generateArticle12Certificate } from './article12.js';
import { GatewayHandlerContext, TrustGateOptions } from './types.js';

/**
 * TrustGate Universal Bouncer Middleware
 * Supports Next.js App Router (NextRequest / NextResponse) and standard Web API Request / Response.
 */
export function withTrustGate(
  handler: (req: any, context: GatewayHandlerContext) => Promise<any>,
  options?: TrustGateOptions
) {
  return async function trustGateMiddleware(req: any): Promise<any> {
    const headers: Headers = req.headers;
    const badge = headers.get('x-concordium-badge') || undefined;
    const agentAddress = headers.get('x-agent-address') || undefined;
    const signature = headers.get('x-agent-signature') || undefined;
    const timestamp = headers.get('x-agent-timestamp') || undefined;
    const endpoint = (req.nextUrl && req.nextUrl.pathname) || (req.url ? new URL(req.url, 'http://localhost').pathname : '/');
    const method = req.method || 'GET';

    // 1. Identity Verification: CIS-8004 & CIS-8
    const identityResult = await verifyAgentIdentity({
      badge,
      agentAddress,
      signature,
      timestamp,
    });

    if (!identityResult.allowed || !identityResult.identity) {
      const errorPayload = {
        error: 'Forbidden',
        statusCode: 403,
        reason: identityResult.reason,
        trustGateNotice: 'Access denied: Requires verified human-backed Concordium agent badge (CIS-8004)',
      };

      if (options?.onAuditRecord) {
        options.onAuditRecord({
          endpoint,
          method,
          decision: 'BLOCKED',
          reason: identityResult.reason,
          riskScore: identityResult.riskScore,
        });
      }

      return new Response(JSON.stringify(errorPayload), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-TrustGate-Decision': 'BLOCKED',
          'X-TrustGate-Reason': identityResult.reason,
        },
      });
    }

    const identity = identityResult.identity;

    // 2. Autonomous Micropayment: x402 Protocol
    const paymentResult = await verifyX402Payment(headers);

    if (!paymentResult.settled || !paymentResult.paymentProof) {
      const challenge = createX402Challenge({
        price: options?.tariff || '0.002',
        currency: options?.currency || 'CCD',
        network: options?.network || 'concordium-testnet',
        recipient: options?.concordiumAccount || '4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc',
      });

      return new Response(JSON.stringify(challenge), {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': `x402 realm="TrustGate", network="${challenge.network}", token="${challenge.currency}", price="${challenge.price}", recipient="${challenge.recipient}"`,
          'X-TrustGate-Decision': 'PAYMENT_REQUIRED',
          'X-TrustGate-Agent-Verified': 'true',
          'X-TrustGate-Owner': identity.concordiumAccount,
        },
      });
    }

    const payment = paymentResult.paymentProof;
    const recordId = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // 3. Optional EU AI Act Article 12 Certificate Hook
    if (options?.enforceArticle12 || options?.onAuditRecord) {
      const cert = generateArticle12Certificate({
        recordId,
        endpoint,
        method,
        identity,
        paymentProof: payment,
        decision: 'ALLOWED',
        statusCode: 200,
      });

      if (options?.onAuditRecord) {
        options.onAuditRecord(cert);
      }
    }

    // 4. Invoke Downstream Handler
    const response = await handler(req, {
      agentIdentity: identity,
      paymentProof: payment,
    });

    response.headers.set('X-TrustGate-Decision', 'ALLOWED');
    response.headers.set('X-TrustGate-Audit-Id', recordId);
    response.headers.set('X-TrustGate-Owner', identity.concordiumAccount);
    response.headers.set('X-TrustGate-Payment-Tx', payment.txHash);

    return response;
  };
}
