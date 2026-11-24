/**
 * TrustGate Core Types
 * Concordium Trusted Agents & x402 Gateway Standard
 */
export type AgentStatus = 'Active' | 'Revoked' | 'Suspended' | 'Unregistered';
export interface ExternalKeyBinding {
    /** CAIP-2 or chain identifier (e.g., "eip155:84532" for Base Sepolia) */
    chain: string;
    /** Address or public key on the external chain */
    address: string;
    /** Identity standard, e.g. "ERC-8004" */
    standard: string;
}
export interface AgentIdentity {
    /** The unique badge identifier or token ID */
    badge: string;
    /** Account address of the verified human/entity owner on Concordium */
    concordiumAccount: string;
    /** Hash of the off-chain or on-chain Agent Card */
    agentCardHash: string;
    /** Current status in the CIS-8004 registry */
    status: AgentStatus;
    /** Optional cross-chain key binding via CIS-8 */
    externalKey?: ExternalKeyBinding;
    /** Name or label of the agent */
    name?: string;
}
export interface VerificationResult {
    allowed: boolean;
    statusCode: 200 | 402 | 403;
    reason: string;
    identity?: AgentIdentity;
    riskScore: number;
}
export interface X402PaymentChallenge {
    status: 402;
    message: string;
    scheme: 'x402';
    network: string;
    currency: string;
    price: string;
    recipient: string;
    facilitatorUrl: string;
    expiresAt: number;
}
export interface X402PaymentProof {
    txHash: string;
    payer: string;
    amount: string;
    currency: string;
    network: string;
    timestamp: number;
    signature?: string;
}
export interface TrustGateOptions {
    /** The Concordium account where micro-payments should be deposited */
    concordiumAccount?: string;
    /** Price tariff per API call (default: '0.002') */
    tariff?: string;
    /** Currency (default: 'CCD') */
    currency?: string;
    /** Network name (default: 'concordium-testnet') */
    network?: string;
    /** Whether to enforce EU AI Act Article 12 compliance logging */
    enforceArticle12?: boolean;
    /** Optional custom registry contract index */
    registryContractIndex?: string;
    /** Callback hook invoked when an audit record is generated */
    onAuditRecord?: (record: any) => void | Promise<void>;
}
export interface GatewayHandlerContext {
    agentIdentity?: AgentIdentity;
    paymentProof?: X402PaymentProof;
}
//# sourceMappingURL=types.d.ts.map