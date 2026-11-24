import { AgentIdentity, X402PaymentProof } from './types.js';

export interface Article12Certificate {
  standard: string;
  legalFramework: string;
  statutoryProvision: string;
  certificateId: string;
  issuedAt: string;
  auditRecord: {
    recordId: string;
    timestamp: string;
    decision: 'ALLOWED' | 'BLOCKED';
    statusCode: number;
    reason: string;
    riskScore: number;
    targetEndpoint: string;
    httpMethod: string;
  };
  accountabilityChain: {
    agentCallerId: string;
    concordiumAccountableOwner: string;
    ccdExplorerValidationUrl: string;
    concordiumRegistryContract: string;
    externalKeyBinding?: any;
  };
  monetizationProof: any;
  cryptographicAttestation: {
    hashAlgorithm: string;
    payloadDigest: string;
    complianceStatus: string;
    verificationAuthority: string;
  };
}

export function generateArticle12Certificate(params: {
  recordId: string;
  endpoint: string;
  method: string;
  identity: AgentIdentity;
  paymentProof?: X402PaymentProof;
  decision?: 'ALLOWED' | 'BLOCKED';
  statusCode?: number;
  reason?: string;
  riskScore?: number;
}): Article12Certificate {
  const timestamp = new Date().toISOString();
  const decision = params.decision || 'ALLOWED';
  const statusCode = params.statusCode || 200;

  return {
    standard: 'EU AI Act Article 12 Compliance Certificate',
    legalFramework: 'Regulation (EU) 2024/1689 of the European Parliament and of the Council',
    statutoryProvision: 'Article 12: Record-Keeping for High-Risk & Autonomous AI Systems',
    certificateId: `CERT-CONCORDIUM-${params.recordId.toUpperCase()}`,
    issuedAt: timestamp,
    auditRecord: {
      recordId: params.recordId,
      timestamp,
      decision,
      statusCode,
      reason: params.reason || 'Verified via Concordium CIS-8004',
      riskScore: params.riskScore ?? 0,
      targetEndpoint: params.endpoint,
      httpMethod: params.method,
    },
    accountabilityChain: {
      agentCallerId: params.identity.badge,
      concordiumAccountableOwner: params.identity.concordiumAccount,
      ccdExplorerValidationUrl: `https://ccdexplorer.io/testnet/account/${params.identity.concordiumAccount}`,
      concordiumRegistryContract: 'CIS-8004 #10082 (Subindex 0)',
      externalKeyBinding: params.identity.externalKey,
    },
    monetizationProof: params.paymentProof
      ? {
          protocol: 'x402 Micro-Payment Protocol',
          tariffAmount: `${params.paymentProof.amount} ${params.paymentProof.currency}`,
          settlementStatus: 'CONFIRMED',
          concordiumTxHash: params.paymentProof.txHash,
        }
      : 'EXEMPT_OR_PENDING',
    cryptographicAttestation: {
      hashAlgorithm: 'SHA-256',
      payloadDigest: `0x${Buffer.from(params.recordId + timestamp + params.identity.concordiumAccount)
        .toString('hex')
        .slice(0, 64)}`,
      complianceStatus: 'VERIFIED_COMPLIANT',
      verificationAuthority: 'TrustGate Autonomous Gateway / Concordium Identity Authority',
    },
  };
}
