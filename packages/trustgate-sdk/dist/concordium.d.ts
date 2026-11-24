import { VerificationResult } from './types.js';
/**
 * Verifies that the request signature came from the claimed external key (EVM Base / ERC-8004).
 */
export declare function verifySignature(params: {
    address: string;
    signature?: string;
    timestamp?: string;
}): boolean;
/**
 * Verifies an agent's Concordium identity using real on-chain / API data.
 */
export declare function verifyAgentIdentity(params: {
    badge?: string;
    agentAddress?: string;
    signature?: string;
    timestamp?: string;
}): Promise<VerificationResult>;
//# sourceMappingURL=concordium.d.ts.map