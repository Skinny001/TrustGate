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
  network: string; // e.g., 'concordium-testnet' | 'base-sepolia'
  currency: string; // e.g., 'CCD' | 'USDC'
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

/**
 * EU AI Act Article 12 compliant audit log record.
 * Tracks autonomous agent actions back to accountable entities.
 */
export interface AuditRecord {
  id: string;
  timestamp: string; // ISO 8601
  endpoint: string;
  method: string;
  agentId: string;
  concordiumOwner: string;
  externalKey?: ExternalKeyBinding;
  decision: 'ALLOWED' | 'BLOCKED';
  statusCode: number;
  reason: string;
  payment?: {
    txHash: string;
    amount: string;
    currency: string;
    settled: boolean;
  };
  riskScore: number;
}

export interface GatewayStats {
  activeAgents: number;
  requestsTotal: number;
  requestsAllowed: number;
  requestsBlocked: number;
  totalSettledAmount: number;
  lastUpdated: string;
}
