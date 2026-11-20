import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/trustgate/audit-store';
import { ethers } from 'ethers';

export async function POST(req: NextRequest) {
  try {
    const { agentType } = (await req.json()) as { agentType: 'agent-a' | 'agent-b' };

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const targetUrl = `${protocol}://${host}/api/gateway/protected-data`;

    if (agentType === 'agent-a') {
      const badge =
        process.env.REAL_AGENT_BADGE ||
        'ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL';
      const callerAddress =
        process.env.REAL_AGENT_EVM_ADDRESS || '0x372b4eB67006F68A9f296b23715055b8A878ABA9';
      const evmPrivateKey = process.env.REAL_AGENT_EVM_PRIVATE_KEY;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-concordium-badge': badge,
        'x-agent-id': process.env.REAL_AGENT_NAME || 'TrustGate Weather Agent',
        'x-agent-address': callerAddress,
      };

      if (evmPrivateKey) {
        try {
          const wallet = new ethers.Wallet(evmPrivateKey);
          const timestamp = Date.now().toString();
          const signature = await wallet.signMessage(`TrustGate-Auth:${timestamp}`);
          headers['x-agent-signature'] = signature;
          headers['x-agent-timestamp'] = timestamp;
          headers['x-agent-address'] = wallet.address;
        } catch {
          // ignore
        }
      }

      // 1. Initial Call -> Expects 402 Payment Required
      const firstRes = await fetch(targetUrl, {
        method: 'GET',
        headers,
      });

      if (firstRes.status === 402) {
        const challenge = await firstRes.json();

        // Settle payment with receipt
        const txHash =
          '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const paymentPayload = {
          txHash,
          payer: headers['x-agent-address'],
          amount: challenge.price,
          currency: challenge.currency,
          network: challenge.network,
          timestamp: Date.now(),
        };

        // 2. Paid Call -> Expects 200 OK
        const secondRes = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            ...headers,
            'x-payment': JSON.stringify(paymentPayload),
          },
        });

        const data = await secondRes.json();
        return NextResponse.json({
          success: true,
          agent: 'Agent A (Verified)',
          decision: 'ALLOWED',
          httpStatus: secondRes.status,
          serviceData: data,
          stats: getStats(),
        });
      } else {
        const errorData = await firstRes.json();
        return NextResponse.json({
          success: false,
          agent: 'Agent A',
          decision: 'FAILED',
          httpStatus: firstRes.status,
          error: errorData,
          stats: getStats(),
        });
      }
    } else {
      // Execute REAL HTTP flow for Agent B (Unverified Rogue Script)
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-agent-id': 'Rogue-Scraper-Bot',
          'x-concordium-badge': 'ccd:agent:unregistered-rogue:v0',
        },
      });

      const body = await res.json();
      return NextResponse.json({
        success: true,
        agent: 'Agent B (Rogue / Blocked)',
        decision: 'BLOCKED',
        httpStatus: res.status,
        response: body,
        stats: getStats(),
      });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
