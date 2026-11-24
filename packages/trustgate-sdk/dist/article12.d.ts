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
export declare function generateArticle12Certificate(params: {
    recordId: string;
    endpoint: string;
    method: string;
    identity: AgentIdentity;
    paymentProof?: X402PaymentProof;
    decision?: 'ALLOWED' | 'BLOCKED';
    statusCode?: number;
    reason?: string;
    riskScore?: number;
}): Article12Certificate;
//# sourceMappingURL=article12.d.ts.map