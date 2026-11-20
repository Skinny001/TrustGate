import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Agent A: Real Cryptographically Signed Agent
 * 
 * Presents its Concordium badge, handles the x402 challenge,
 * and settles the micro-payment.
 */
async function runAgentA() {
  const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3000/api/gateway/protected-data';

  const badge =
    process.env.REAL_AGENT_BADGE ||
    'ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL';
  const callerAddress =
    process.env.REAL_AGENT_EVM_ADDRESS || '0x372b4eB67006F68A9f296b23715055b8A878ABA9';
  const agentName = process.env.REAL_AGENT_NAME || 'TrustGate Weather Agent';
  const privateKey = process.env.REAL_AGENT_EVM_PRIVATE_KEY;

  console.log('====================================================');
  console.log('🤖 AGENT A (REAL DATA): INITIATING REQUEST');
  console.log('====================================================');
  console.log(`🔑 Agent Public Key (EVM): ${callerAddress}`);
  console.log(`🎖️ Concordium Badge: ${badge}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-concordium-badge': badge,
    'x-agent-id': agentName,
    'x-agent-address': callerAddress,
  };

  if (privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const timestamp = Date.now().toString();
      const signature = await wallet.signMessage(`TrustGate-Auth:${timestamp}`);
      headers['x-agent-signature'] = signature;
      headers['x-agent-timestamp'] = timestamp;
      headers['x-agent-address'] = wallet.address;
      console.log(`✍️ Signed Cryptographic Proof: ${signature.slice(0, 32)}…`);
    } catch {
      // ignore
    }
  }

  console.log('\n1️⃣ Step 1: Sending request with Concordium badge proof...');
  let res = await fetch(GATEWAY_URL, {
    method: 'GET',
    headers,
  });

  console.log(`📡 Response Status: ${res.status} (${res.statusText})`);

  if (res.status === 402) {
    console.log('\n2️⃣ Step 2: Received HTTP 402 Payment Required challenge from TrustGate!');
    const challenge = await res.json();
    console.log('💳 Payment Parameters:', {
      scheme: challenge.scheme,
      network: challenge.network,
      currency: challenge.currency,
      price: challenge.price,
      recipient: challenge.recipient,
      facilitator: challenge.facilitatorUrl,
    });

    console.log('\n3️⃣ Step 3: Settling micro-payment via x402...');
    const simulatedTxHash =
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    console.log(`🔗 Transaction Hash: ${simulatedTxHash}`);

    const paymentProof = {
      txHash: simulatedTxHash,
      payer: headers['x-agent-address'],
      amount: challenge.price,
      currency: challenge.currency,
      network: challenge.network,
      timestamp: Date.now(),
    };

    console.log('\n4️⃣ Step 4: Retrying request with x402 payment proof header...');
    res = await fetch(GATEWAY_URL, {
      method: 'GET',
      headers: {
        ...headers,
        'x-payment': JSON.stringify(paymentProof),
      },
    });

    console.log(`📡 Final Response Status: ${res.status} (${res.statusText})`);
    if (res.ok) {
      const data = await res.json();
      console.log('\n🎉 SUCCESS: Data received from protected service:');
      console.dir(data, { depth: null });
      console.log('\n🛡️ Verification Audit Headers:');
      console.log('• X-TrustGate-Decision:', res.headers.get('x-trustgate-decision'));
      console.log('• X-TrustGate-Owner:', res.headers.get('x-trustgate-owner'));
      console.log('• X-TrustGate-Audit-Id:', res.headers.get('x-trustgate-audit-id'));
    } else {
      console.error('❌ Request failed:', await res.text());
    }
  } else if (res.ok) {
    console.log('✅ Access granted directly:', await res.json());
  } else {
    console.error('❌ Access denied:', await res.text());
  }
}

runAgentA().catch(console.error);
