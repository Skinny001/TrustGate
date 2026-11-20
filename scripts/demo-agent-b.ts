/**
 * Agent B: The Unverified / Rogue Script
 * 
 * Lacks a verified Concordium badge (CIS-8004)
 * Expected Result: 403 Forbidden
 */

async function runAgentB() {
  const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3000/api/gateway/protected-data';

  console.log('====================================================');
  console.log('🛑 AGENT B (UNVERIFIED): INITIATING REQUEST');
  console.log('====================================================');

  console.log('1️⃣ Step 1: Sending request WITHOUT verified badge...');
  const res = await fetch(GATEWAY_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-agent-id': 'Rogue-Scraper-Bot-v9',
      // Deliberately no x-concordium-badge or invalid badge
      'x-concordium-badge': 'ccd:agent:fake-unregistered:v0',
    },
  });

  console.log(`📡 Response Status: ${res.status} (${res.statusText})`);
  const body = await res.json();
  console.log('🚫 Rejection Response from TrustGate:');
  console.dir(body, { depth: null });
  console.log('\n🛡️ Bouncer Audit Headers:');
  console.log('• X-TrustGate-Decision:', res.headers.get('x-trustgate-decision'));
  console.log('• X-TrustGate-Reason:', res.headers.get('x-trustgate-reason'));
}

runAgentB().catch(console.error);
