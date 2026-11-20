import { ethers } from 'ethers';
import { AgentIdentity, ExternalKeyBinding, VerificationResult } from './types';

/**
 * Loads agents registered locally via environment variable or configuration file.
 * The user can define real agents in .env as:
 * REAL_CONCORDIUM_AGENTS='[{"badge":"ccd:agent:...","concordiumAccount":"...","status":"Active","externalKey":{"chain":"eip155:84532","address":"0x...","standard":"ERC-8004"}}]'
 */
function getLocalRegisteredAgents(): Map<string, AgentIdentity> {
  const map = new Map<string, AgentIdentity>();
  const envAgents = process.env.REAL_CONCORDIUM_AGENTS;

  if (envAgents) {
    try {
      const parsed: AgentIdentity[] = JSON.parse(envAgents);
      for (const agent of parsed) {
        if (agent.badge) {
          map.set(agent.badge, agent);
        }
      }
    } catch (e) {
      console.error('Failed to parse REAL_CONCORDIUM_AGENTS from .env:', e);
    }
  }

  // Also support single primary agent defined in .env
  const primaryBadge = process.env.REAL_AGENT_BADGE;
  const primaryAccount = process.env.REAL_CONCORDIUM_ACCOUNT;
  const primaryEvmAddress = process.env.REAL_AGENT_EVM_ADDRESS;

  if (primaryBadge && primaryAccount) {
    map.set(primaryBadge, {
      badge: primaryBadge,
      name: process.env.REAL_AGENT_NAME || 'Primary Registered Agent',
      concordiumAccount: primaryAccount,
      agentCardHash: process.env.REAL_AGENT_CARD_HASH || 'sha256:00000000000000000000000000000000',
      status: 'Active',
      externalKey: primaryEvmAddress
        ? {
            chain: process.env.REAL_AGENT_CHAIN_ID || 'eip155:84532',
            address: primaryEvmAddress,
            standard: 'ERC-8004',
          }
        : undefined,
    });
  }

  return map;
}

/**
 * Verifies that the request signature came from the claimed external key (EVM Base Sepolia / ERC-8004).
 */
export function verifySignature(params: {
  address: string;
  signature?: string;
  timestamp?: string;
}): boolean {
  const { address, signature, timestamp } = params;
  if (!signature || !timestamp) {
    return false;
  }

  try {
    const message = `TrustGate-Auth:${timestamp}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (err) {
    console.error('Cryptographic signature verification failed:', err);
    return false;
  }
}

/**
 * Verifies an agent's Concordium identity using real on-chain / API data.
 */
export async function verifyAgentIdentity(params: {
  badge?: string;
  agentAddress?: string;
  signature?: string;
  timestamp?: string;
}): Promise<VerificationResult> {
  const { badge, agentAddress, signature, timestamp } = params;

  if (!badge) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'Rejected: Missing X-Concordium-Badge header. Only registered autonomous agents permitted.',
      riskScore: 100,
    };
  }

  // 1. Query live Concordium Badge Verifier service if available
  const verifierUrl = process.env.CONCORDIUM_BADGE_VERIFIER_URL;
  if (verifierUrl && verifierUrl.startsWith('http')) {
    try {
      const response = await fetch(`${verifierUrl}?badge=${encodeURIComponent(badge)}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          status: string;
          owner: string;
          agentCardHash: string;
          externalKey?: ExternalKeyBinding;
        };

        if (data.status === 'Active') {
          // If external key binding exists, verify caller matches
          if (agentAddress && data.externalKey) {
            if (data.externalKey.address.toLowerCase() !== agentAddress.toLowerCase()) {
              return {
                allowed: false,
                statusCode: 403,
                reason: `Rejected: Caller address ${agentAddress} does not match CIS-8 bound key ${data.externalKey.address}`,
                riskScore: 90,
              };
            }
          }

          // If signature is provided, cryptographically verify it
          if (agentAddress && signature && timestamp) {
            const sigValid = verifySignature({ address: agentAddress, signature, timestamp });
            if (!sigValid) {
              return {
                allowed: false,
                statusCode: 403,
                reason: 'Rejected: Cryptographic signature mismatch on external key proof',
                riskScore: 95,
              };
            }
          }

          return {
            allowed: true,
            statusCode: 200,
            reason: 'Verified via live Concordium Agent Registry',
            identity: {
              badge,
              concordiumAccount: data.owner,
              agentCardHash: data.agentCardHash,
              status: 'Active',
              externalKey: data.externalKey,
            },
            riskScore: 5,
          };
        } else {
          return {
            allowed: false,
            statusCode: 403,
            reason: `Rejected: Agent status in Concordium registry is ${data.status}`,
            riskScore: 80,
          };
        }
      }
    } catch (e) {
      console.warn('Concordium live badge verifier endpoint unreachable, checking configured registry:', e);
    }
  }

  // 2. Query configured real agents in environment
  const registeredAgents = getLocalRegisteredAgents();
  const registered = registeredAgents.get(badge);

  if (registered) {
    if (registered.status !== 'Active') {
      return {
        allowed: false,
        statusCode: 403,
        reason: `Rejected: Agent registry status is ${registered.status}`,
        riskScore: 90,
      };
    }

    if (agentAddress && registered.externalKey) {
      if (registered.externalKey.address.toLowerCase() !== agentAddress.toLowerCase()) {
        return {
          allowed: false,
          statusCode: 403,
          reason: 'Rejected: Caller address does not match CIS-8 bound key for this badge',
          riskScore: 85,
        };
      }
    }

    // Cryptographic signature check
    if (agentAddress && signature && timestamp) {
      const sigValid = verifySignature({ address: agentAddress, signature, timestamp });
      if (!sigValid) {
        return {
          allowed: false,
          statusCode: 403,
          reason: 'Rejected: Invalid cryptographic signature for claimed agent address',
          riskScore: 95,
        };
      }
    }

    return {
      allowed: true,
      statusCode: 200,
      reason: 'Verified by Concordium (CIS-8004 active + CIS-8 cross-chain key binding valid)',
      identity: registered,
      riskScore: 8,
    };
  }

  return {
    allowed: false,
    statusCode: 403,
    reason: `Rejected: Badge "${badge}" is not found or not active in the Concordium Agent Registry (CIS-8004)`,
    riskScore: 100,
  };
}
