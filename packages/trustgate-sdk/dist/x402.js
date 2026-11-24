"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createX402Challenge = createX402Challenge;
exports.verifyX402Payment = verifyX402Payment;
function createX402Challenge(options) {
    return {
        status: 402,
        message: 'Payment Required: Settle x402 autonomous micro-payment to access this endpoint.',
        scheme: 'x402',
        network: options?.network || 'concordium-testnet',
        currency: options?.currency || 'CCD',
        price: options?.price || '0.002',
        recipient: options?.recipient || '4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc',
        facilitatorUrl: options?.facilitatorUrl || 'https://x402.org/facilitator',
        expiresAt: Date.now() + 1000 * 60 * 5, // 5 min TTL
    };
}
async function verifyX402Payment(headers) {
    const paymentHeader = headers.get('x-payment') || headers.get('authorization');
    const txHeader = headers.get('x-payment-tx');
    if (!paymentHeader && !txHeader) {
        return {
            settled: false,
            error: 'Missing x402 payment header',
        };
    }
    // 1. Direct Tx Header Check
    if (txHeader) {
        return {
            settled: true,
            paymentProof: {
                txHash: txHeader,
                payer: headers.get('x-agent-address') || '0x0000000000000000000000000000000000000000',
                amount: '0.002',
                currency: 'CCD',
                network: 'concordium-testnet',
                timestamp: Date.now(),
            },
        };
    }
    // 2. Parsed JSON payload
    if (paymentHeader) {
        try {
            let rawJson = paymentHeader;
            if (paymentHeader.toLowerCase().startsWith('x402 ')) {
                rawJson = paymentHeader.slice(5).trim();
            }
            let parsed;
            if (rawJson.startsWith('{')) {
                parsed = JSON.parse(rawJson);
            }
            else {
                const decoded = Buffer.from(rawJson, 'base64').toString('utf-8');
                parsed = JSON.parse(decoded);
            }
            if (parsed.txHash || parsed.transactionHash || parsed.tx) {
                return {
                    settled: true,
                    paymentProof: {
                        txHash: parsed.txHash || parsed.transactionHash || parsed.tx,
                        payer: parsed.payer || headers.get('x-agent-address') || 'verified-caller',
                        amount: parsed.amount || '0.002',
                        currency: parsed.currency || 'CCD',
                        network: parsed.network || 'concordium-testnet',
                        timestamp: parsed.timestamp || Date.now(),
                        signature: parsed.signature,
                    },
                };
            }
        }
        catch {
            // ignore
        }
    }
    return {
        settled: false,
        error: 'Invalid payment proof format',
    };
}
//# sourceMappingURL=x402.js.map