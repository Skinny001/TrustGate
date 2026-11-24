"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTrustGate = withTrustGate;
const concordium_js_1 = require("./concordium.js");
const x402_js_1 = require("./x402.js");
const article12_js_1 = require("./article12.js");
/**
 * TrustGate Universal Bouncer Middleware
 * Supports Next.js App Router (NextRequest / NextResponse) and standard Web API Request / Response.
 */
function withTrustGate(handler, options) {
    return async function trustGateMiddleware(req) {
        const headers = req.headers;
        const badge = headers.get('x-concordium-badge') || undefined;
        const agentAddress = headers.get('x-agent-address') || undefined;
        const signature = headers.get('x-agent-signature') || undefined;
        const timestamp = headers.get('x-agent-timestamp') || undefined;
        const endpoint = (req.nextUrl && req.nextUrl.pathname) || (req.url ? new URL(req.url, 'http://localhost').pathname : '/');
        const method = req.method || 'GET';
        // 1. Identity Verification: CIS-8004 & CIS-8
        const identityResult = await (0, concordium_js_1.verifyAgentIdentity)({
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
        const paymentResult = await (0, x402_js_1.verifyX402Payment)(headers);
        if (!paymentResult.settled || !paymentResult.paymentProof) {
            const challenge = (0, x402_js_1.createX402Challenge)({
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
            const cert = (0, article12_js_1.generateArticle12Certificate)({
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
//# sourceMappingURL=gateway.js.map