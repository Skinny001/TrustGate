import { NextRequest, NextResponse } from 'next/server';
import { withTrustGate } from '@/lib/trustgate/gateway';

/**
 * Sample High-Value Service (e.g. Real-Time Specialized Weather & Compute Intelligence)
 * Protected entirely by TrustGate.
 */
export async function GET(req: NextRequest) {
  return withTrustGate(req, async ({ agentIdentity, paymentProof }) => {
    return NextResponse.json({
      status: 'success',
      data: {
        service: 'TrustGate Weather & Geo-Telemetry API',
        timestamp: new Date().toISOString(),
        location: {
          city: 'Lagos',
          coordinates: { lat: 6.5244, lon: 3.3792 },
        },
        telemetry: {
          temperature_c: 29.4,
          humidity_pct: 78,
          air_quality_index: 34,
          atmospheric_pressure_hpa: 1012,
          solar_radiation_wm2: 680,
        },
        accessGrant: {
          callerBadge: agentIdentity?.badge,
          verifiedOwner: agentIdentity?.concordiumAccount,
          crossChainKey: agentIdentity?.externalKey?.address,
          paymentSettled: paymentProof?.amount + ' ' + paymentProof?.currency,
          paymentTx: paymentProof?.txHash,
        },
      },
    });
  });
}

export async function POST(req: NextRequest) {
  return withTrustGate(req, async ({ agentIdentity, paymentProof }) => {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    return NextResponse.json({
      status: 'success',
      receivedQuery: body,
      service: 'TrustGate Weather & Geo-Telemetry API (Compute Action)',
      timestamp: new Date().toISOString(),
      computationResult: {
        executionCostCCD: paymentProof?.amount,
        txReceipt: paymentProof?.txHash,
        authorizedByConcordiumAccount: agentIdentity?.concordiumAccount,
        message: 'Telemetry inference completed successfully.',
      },
    });
  });
}
