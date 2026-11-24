import { X402PaymentChallenge, X402PaymentProof } from './types.js';
export declare function createX402Challenge(options?: {
    price?: string;
    currency?: string;
    network?: string;
    recipient?: string;
    facilitatorUrl?: string;
}): X402PaymentChallenge;
export declare function verifyX402Payment(headers: Headers): Promise<{
    settled: boolean;
    paymentProof?: X402PaymentProof;
    error?: string;
}>;
//# sourceMappingURL=x402.d.ts.map