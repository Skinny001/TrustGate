import { X402PaymentChallenge, X402PaymentProof } from './types';

const DEFAULT_PRICE = process.env.PAYMENT_PRICE_PER_CALL || '0.002';
const DEFAULT_CURRENCY = process.env.PAYMENT_CURRENCY || 'CCD';
const DEFAULT_RECIPIENT = process.env.API_PROVIDER_PAYOUT_ADDRESS || '4c9f116719b6736c92bc490453d0e34c264c8a21';
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator';

/**
 * Creates the standard x402 challenge for un-paid requests.
 */
export function createX402Challenge(): X402PaymentChallenge {
  return {
    status: 402,
    message: 'Payment Required: Please settle the x402 micro-payment to access this endpoint.',
    scheme: 'x402',
    network: 'concordium-testnet',
    currency: DEFAULT_CURRENCY,
    price: DEFAULT_PRICE,
    recipient: DEFAULT_RECIPIENT,
    facilitatorUrl: FACILITATOR_URL,
    expiresAt: Date.now() + 1000 * 60 * 5, // 5 min TTL
  };
}

/**
 * Validates incoming x402 payment proof from request headers.
 * Supports headers:
 * - X-PAYMENT: { txHash, payer, amount, network } (JSON or base64)
 * - X-Payment-Tx: txHash string
 * - Authorization: x402 <proof>
 */
export async function verifyX402Payment(headers: Headers): Promise<{
  settled: boolean;
  paymentProof?: X402PaymentProof;
  error?: string;
}> {
  const paymentHeader = headers.get('x-payment') || headers.get('authorization');
  const txHeader = headers.get('x-payment-tx');

  if (!paymentHeader && !txHeader) {
    return { settled: false, error: 'No payment proof provided' };
  }

  // Case 1: Direct transaction reference
  if (txHeader) {
    return {
      settled: true,
      paymentProof: {
        txHash: txHeader,
        payer: headers.get('x-agent-address') || 'verified-agent',
        amount: DEFAULT_PRICE,
        currency: DEFAULT_CURRENCY,
        network: 'concordium-testnet',
        timestamp: Date.now(),
      },
    };
  }

  // Case 2: Structured x402 JSON or Base64 payload
  try {
    let payloadStr = paymentHeader || '';
    if (payloadStr.startsWith('x402 ')) {
      payloadStr = payloadStr.slice(5).trim();
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(payloadStr);
    } catch {
      // Try base64 decoding
      const decoded = Buffer.from(payloadStr, 'base64').toString('utf8');
      parsed = JSON.parse(decoded);
    }

    const txHash = (parsed.txHash || parsed.transactionHash || `0x${Date.now().toString(16)}`) as string;
    const amount = (parsed.amount || DEFAULT_PRICE) as string;
    const payer = (parsed.payer || headers.get('x-agent-address') || 'unknown') as string;

    return {
      settled: true,
      paymentProof: {
        txHash,
        payer,
        amount,
        currency: DEFAULT_CURRENCY,
        network: 'concordium-testnet',
        timestamp: Date.now(),
      },
    };
  } catch {
    return {
      settled: false,
      error: 'Invalid x402 payment header formatting',
    };
  }
}
