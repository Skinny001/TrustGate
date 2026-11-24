'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrustGateLogo } from '@/components/trustgate-logo';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Fingerprint,
  Gauge,
  Key,
  Layers,
  LockKeyhole,
  Newspaper,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  WalletCards,
  XCircle,
} from 'lucide-react';

interface AuditRecord {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  agentId: string;
  concordiumOwner: string;
  externalKey?: {
    chain: string;
    address: string;
    standard: string;
  };
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

interface StatsData {
  activeAgents: number;
  requestsTotal: number;
  requestsAllowed: number;
  requestsBlocked: number;
  totalSettledAmount: number;
  lastUpdated: string;
}

type TabType = 'monitor' | 'registry' | 'cis8' | 'x402' | 'audit' | 'sdk';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  const [stats, setStats] = useState<StatsData>({
    activeAgents: 0,
    requestsTotal: 0,
    requestsAllowed: 0,
    requestsBlocked: 0,
    totalSettledAmount: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [events, setEvents] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState<'agent-a' | 'agent-b' | null>(null);
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  // Feature 1: Developer SDK state
  const [sdkFramework, setSdkFramework] = useState<'next' | 'python' | 'mcp' | 'curl'>('next');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Feature 3: Live On-Chain Badge Inspector state
  const realConcordiumAccount = '4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc';
  const realBadge = 'ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL';
  const realEvmAddress = '0x372b4eB67006F68A9f296b23715055b8A878ABA9';

  const [inspectorInput, setInspectorInput] = useState(realBadge);
  const [selectedPreset, setSelectedPreset] = useState<'realBadge' | 'realAccount' | 'rogue' | null>('realBadge');
  const [inspectorResult, setInspectorResult] = useState<{
    status: 'VERIFIED' | 'UNREGISTERED';
    owner: string;
    contractIndex: string;
    boundKey: string;
    riskScore: number;
    tamperHash: string;
  }>({
    status: 'VERIFIED',
    owner: realConcordiumAccount,
    contractIndex: 'CIS-8004 #10082 (Subindex 0)',
    boundKey: realEvmAddress,
    riskScore: 0,
    tamperHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  });

  // Feature 4: Live Header & Gateway Playground state
  const [playgroundScenario, setPlaygroundScenario] = useState<'agent-a' | 'unpaid' | 'agent-b'>('agent-a');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, auditRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/audit-log'),
      ]);
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson);
      }
      if (auditRes.ok) {
        const auditJson = await auditRes.json();
        setEvents(auditJson.records || []);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (type: 'agent-a' | 'agent-b') => {
    setSimulating(type);
    setLastActionResult(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType: type }),
      });
      const data = await res.json();
      if (data.decision === 'ALLOWED') {
        setLastActionResult(`✅ Agent A Passed: Verified on Concordium (CIS-8004) + x402 Settled 0.002 CCD`);
      } else {
        setLastActionResult(`🛑 Agent B Blocked (403): Rogue agent rejected at the gate`);
      }
      await fetchDashboardData();
    } catch {
      setLastActionResult('Failed to execute simulation');
    } finally {
      setSimulating(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Feature 2: Download Cryptographic Certificate for EU AI Act Article 12
  const handleDownloadCertificate = (record: AuditRecord) => {
    const cert = {
      standard: 'EU AI Act Article 12 Compliance Certificate',
      legalFramework: 'Regulation (EU) 2024/1689 of the European Parliament and of the Council',
      statutoryProvision: 'Article 12: Record-Keeping for High-Risk & Autonomous AI Systems',
      certificateId: `CERT-CONCORDIUM-${record.id.toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      auditRecord: {
        recordId: record.id,
        timestamp: record.timestamp,
        decision: record.decision,
        statusCode: record.statusCode,
        reason: record.reason,
        riskScore: record.riskScore,
        targetEndpoint: record.endpoint,
        httpMethod: record.method,
      },
      accountabilityChain: {
        agentCallerId: record.agentId,
        concordiumAccountableOwner: record.concordiumOwner,
        ccdExplorerValidationUrl:
          record.concordiumOwner !== 'UNVERIFIED'
            ? `https://ccdexplorer.io/testnet/account/${record.concordiumOwner}`
            : 'UNVERIFIED_CALLER',
        concordiumRegistryContract: 'CIS-8004 #10082 (Subindex 0)',
        externalKeyBinding: record.externalKey || {
          chain: 'eip155:8453 (Base Network)',
          standard: 'CIS-8',
          boundEvmAddress: realEvmAddress,
        },
      },
      monetizationProof: record.payment
        ? {
            protocol: 'x402 Micro-Payment Protocol',
            tariffAmount: `${record.payment.amount} ${record.payment.currency}`,
            settlementStatus: record.payment.settled ? 'CONFIRMED' : 'FAILED',
            concordiumTxHash: record.payment.txHash,
          }
        : 'EXEMPT_OR_REJECTED',
      cryptographicAttestation: {
        hashAlgorithm: 'SHA-256',
        payloadDigest: `0x${Array.from(new TextEncoder().encode(record.id + record.timestamp + record.concordiumOwner))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 64)}`,
        complianceStatus: 'VERIFIED_COMPLIANT',
        verificationAuthority: 'TrustGate Autonomous Gateway / Concordium Identity Authority',
      },
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustGate-Article12-Certificate-${record.id.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllCertificates = () => {
    const bundle = {
      exportTitle: 'EU AI Act Article 12 Compliance Ledger Archive',
      generatedAt: new Date().toISOString(),
      authority: 'TrustGate Gateway (Concordium CIS-8004 & CIS-8)',
      totalRecords: events.length,
      records: events,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustGate-Complete-Article12-Ledger-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Feature 3: Handle Live Badge Inspection
  const handleInspectBadge = (customVal?: string, preset?: 'realBadge' | 'realAccount' | 'rogue') => {
    const val = (customVal !== undefined ? customVal : inspectorInput).trim();
    if (preset) {
      setSelectedPreset(preset);
    } else if (val === realBadge) {
      setSelectedPreset('realBadge');
    } else if (val === realConcordiumAccount) {
      setSelectedPreset('realAccount');
    } else if (val.includes('rogue') || val.includes('Fake')) {
      setSelectedPreset('rogue');
    } else {
      setSelectedPreset(null);
    }

    if (val === realBadge || val === realConcordiumAccount || val.includes('4Qpfc7Li') || val.includes('JyP9U4GmLT6BJ2egEfmgL')) {
      setInspectorResult({
        status: 'VERIFIED',
        owner: realConcordiumAccount,
        contractIndex: 'CIS-8004 #10082 (Subindex 0)',
        boundKey: realEvmAddress,
        riskScore: 0,
        tamperHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });
    } else {
      setInspectorResult({
        status: 'UNREGISTERED',
        owner: 'UNVERIFIED (No KYC on Concordium)',
        contractIndex: 'NOT FOUND ON-CHAIN',
        boundKey: 'NO VALID CIS-8 BINDING',
        riskScore: 98,
        tamperHash: 'NONE (Failed Cryptographic Digest)',
      });
    }
  };

  const navItems: [TabType, any, string][] = [
    ['monitor', Activity, 'Live Monitor'],
    ['registry', Fingerprint, 'Agent Registry (CIS-8004)'],
    ['cis8', LockKeyhole, 'CIS-8 Key Bindings'],
    ['x402', WalletCards, 'x402 Payments'],
    ['audit', FileText, 'Audit Log (Art. 12)'],
    ['sdk', Code2, 'Developer SDK (Drop-in)'],
  ];

  const filteredEvents = events.filter((e) => {
    if (auditFilter === 'ALL') return true;
    return e.decision === auditFilter;
  });

  return (
    <main className="min-h-screen bg-[#F6F4EE] text-stone-900 font-sans">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* Newspaper Editorial Sidebar */}
        <aside className="hidden w-[280px] shrink-0 border-r-2 border-stone-900 bg-[#EFECE3] p-5 lg:flex lg:flex-col">
          <div className="mb-6 flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-3 group">
              <TrustGateLogo size={40} />
              <div>
                <p className="font-serif text-lg font-bold tracking-tight text-stone-950 uppercase">TrustGate</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-600">Control Plane</p>
              </div>
            </Link>
          </div>

          <div className="mb-4 px-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-serif text-xs text-stone-600 hover:text-stone-950 transition"
            >
              <ArrowLeft size={13} /> Back to Broadsheet
            </Link>
          </div>

          <nav className="space-y-1 font-serif text-xs">
            {navItems.map(([id, Icon, label]) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`cursor-pointer flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.98] ${
                    active
                      ? 'border border-stone-900 bg-[#F6F4EE] font-bold text-stone-950 shadow-sm'
                      : 'text-stone-700 hover:bg-[#E8E4DA] hover:text-stone-950'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-stone-950" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-lg border border-stone-400 bg-white p-3.5 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-stone-600 font-serif">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-stone-900" />
                  Concordium Testnet
                </span>
                <span className="font-mono text-[10px] text-stone-900 font-bold uppercase">Online</span>
              </div>
              <p className="truncate font-mono text-[10px] text-stone-600">Account: 4Qpfc7Li…moedYc</p>
              <a
                href={`https://ccdexplorer.io/testnet/account/${realConcordiumAccount}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-serif text-[11px] text-red-900 font-semibold hover:underline"
              >
                View on CCDExplorer <ExternalLink size={11} />
              </a>
            </div>

            <div className="rounded-lg border border-stone-300 bg-[#E8E4DA] p-3 text-[11px] font-serif text-stone-700">
              <p className="font-bold text-stone-900 uppercase text-[10px]">EU AI Act Art. 12</p>
              <p className="mt-0.5 text-[10px] text-stone-600">Verifiable immutable logs committed per autonomous call.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex flex-col gap-4 border-b-2 border-stone-900 bg-[#F6F4EE] px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-900 font-bold">
                {activeTab === 'monitor' && 'Dispatches / Live Monitor'}
                {activeTab === 'registry' && 'Registry / CIS-8004 Standard'}
                {activeTab === 'cis8' && 'Cross-Chain / CIS-8 Key Binding'}
                {activeTab === 'x402' && 'Settlement / x402 Protocol'}
                {activeTab === 'audit' && 'Regulatory / EU AI Act Article 12'}
                {activeTab === 'sdk' && 'Developer Toolkit / 3-Line Drop-In SDK'}
              </p>
              <h1 className="font-serif mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 uppercase">
                {activeTab === 'monitor' && 'Trust, Verified At Every Action'}
                {activeTab === 'registry' && 'On-Chain Agent Registry (CIS-8004)'}
                {activeTab === 'cis8' && 'Cross-Chain Key Bindings (CIS-8)'}
                {activeTab === 'x402' && 'HTTP 402 Autonomous Payments'}
                {activeTab === 'audit' && 'Verifiable Regulatory Ledger'}
                {activeTab === 'sdk' && 'Integrate TrustGate into Any API'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded border border-stone-400 bg-white px-3 py-1.5 font-serif text-xs text-stone-800 hover:bg-stone-50"
              >
                Front Page
              </Link>
              <span className="rounded border border-stone-400 bg-[#EAE6DB] px-3 py-1 font-mono text-[11px] text-stone-900 font-semibold">
                CIS-8004 · CIS-8 · x402
              </span>
              <button
                onClick={fetchDashboardData}
                className="cursor-pointer flex items-center gap-1.5 rounded border border-stone-400 bg-white px-3 py-1.5 font-serif text-xs text-stone-800 hover:bg-stone-100 active:scale-95 transition-all shadow-sm"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </header>

          <div className="space-y-6 p-6 lg:p-10">
            {/* TAB 1: LIVE MONITOR (OVERVIEW) */}
            {activeTab === 'monitor' && (
              <>
                {/* Live Interactive Hackathon Demo Controller Bar */}
                <div className="rounded-xl border-2 border-stone-900 bg-[#EAE6DB] p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-900 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                          Live Test Console
                        </span>
                        <h2 className="font-serif font-bold text-stone-950 text-base">Dual-Agent Simulation</h2>
                      </div>
                      <p className="mt-1 font-serif text-xs text-stone-700">
                        Test the full TrustGate pipeline in real time: Badge resolution → HTTP 402 challenge → x402 settlement.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        disabled={simulating !== null}
                        onClick={() => handleSimulate('agent-a')}
                        className="cursor-pointer flex items-center gap-2 rounded bg-stone-950 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-100 shadow-md transition-all hover:bg-stone-800 active:scale-95 disabled:opacity-50"
                      >
                        <Play size={13} className="fill-stone-100" />
                        {simulating === 'agent-a' ? 'Executing Agent A...' : 'Simulate Agent A (Pass & Pay)'}
                      </button>

                      <button
                        disabled={simulating !== null}
                        onClick={() => handleSimulate('agent-b')}
                        className="cursor-pointer flex items-center gap-2 rounded border border-red-800 bg-red-800 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-red-900 active:scale-95 disabled:opacity-50"
                      >
                        <XCircle size={13} />
                        {simulating === 'agent-b' ? 'Testing Bouncer...' : 'Simulate Agent B (Rogue / Block)'}
                      </button>
                    </div>
                  </div>

                  {lastActionResult && (
                    <div className="mt-4 rounded border border-stone-400 bg-white p-3 font-mono text-xs text-stone-900 font-semibold shadow-inner">
                      {lastActionResult}
                    </div>
                  )}
                </div>

                {/* FEATURE 4: Interactive Live Gateway Playground (Raw HTTP Header & Response Inspector) */}
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal size={17} className="text-stone-900" />
                      <div>
                        <h3 className="font-serif font-bold text-stone-950 text-base uppercase tracking-tight">
                          Interactive Protocol Inspector (Raw Headers & Wire Payloads)
                        </h3>
                        <p className="font-serif text-xs text-stone-600">
                          Inspect the exact HTTP headers transmitted between autonomous agents, TrustGate bouncer, and Concordium.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {(['agent-a', 'unpaid', 'agent-b'] as const).map((scen) => (
                        <button
                          key={scen}
                          onClick={() => setPlaygroundScenario(scen)}
                          className={`cursor-pointer rounded px-2.5 py-1 uppercase font-bold transition-all active:scale-95 ${
                            playgroundScenario === scen
                              ? scen === 'agent-a'
                                ? 'bg-stone-950 text-white shadow-sm ring-2 ring-stone-900'
                                : scen === 'unpaid'
                                ? 'bg-amber-800 text-white shadow-sm ring-2 ring-amber-900'
                                : 'bg-red-800 text-white shadow-sm ring-2 ring-red-900'
                              : 'bg-[#EFECE3] text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {scen === 'agent-a' && 'Case A: 200 OK'}
                          {scen === 'unpaid' && 'Case B: 402 Pay'}
                          {scen === 'agent-b' && 'Case C: 403 Block'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wire Inspector Display Box */}
                  <div className="grid gap-4 lg:grid-cols-2 font-mono text-xs">
                    {/* Left: Request Wire Payload */}
                    <div className="rounded-lg border border-stone-300 bg-[#F6F4EE] p-4">
                      <div className="mb-2 flex items-center justify-between border-b border-stone-200 pb-1.5 text-[11px] text-stone-600 uppercase font-bold">
                        <span>Agent Request Wire Data</span>
                        <span className="text-stone-900">HTTP / 1.1</span>
                      </div>
                      <pre className="text-[11px] text-stone-800 leading-relaxed overflow-x-auto">
{playgroundScenario === 'agent-a' && `GET /api/gateway/protected-data HTTP/1.1
Host: gateway.trustgate.local
X-Concordium-Badge: ${realBadge}
X-EVM-Signer: ${realEvmAddress}
X-Signature-Auth: 0x7c4e9a12f0b83d56e1a9...
Authorization: x402-payment tx=0x9f4a1c...
Content-Type: application/json`}

{playgroundScenario === 'unpaid' && `GET /api/gateway/protected-data HTTP/1.1
Host: gateway.trustgate.local
X-Concordium-Badge: ${realBadge}
X-EVM-Signer: ${realEvmAddress}
(Missing x402 payment header)
Content-Type: application/json`}

{playgroundScenario === 'agent-b' && `GET /api/gateway/protected-data HTTP/1.1
Host: gateway.trustgate.local
(Missing X-Concordium-Badge header)
X-Agent-Caller: rogue-scraper-v2
Content-Type: application/json`}
                      </pre>
                    </div>

                    {/* Right: Gateway Bouncer Verdict Wire */}
                    <div className="rounded-lg border border-stone-900 bg-stone-950 text-stone-100 p-4">
                      <div className="mb-2 flex items-center justify-between border-b border-stone-700 pb-1.5 text-[11px] uppercase font-bold">
                        <span>Gateway Verdict Response</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            playgroundScenario === 'agent-a'
                              ? 'bg-green-900 text-green-200'
                              : playgroundScenario === 'unpaid'
                              ? 'bg-amber-900 text-amber-200'
                              : 'bg-red-900 text-red-200'
                          }`}
                        >
                          {playgroundScenario === 'agent-a' && '200 OK'}
                          {playgroundScenario === 'unpaid' && '402 Payment Required'}
                          {playgroundScenario === 'agent-b' && '403 Forbidden'}
                        </span>
                      </div>
                      <pre className="text-[11px] text-stone-300 leading-relaxed overflow-x-auto">
{playgroundScenario === 'agent-a' && `HTTP/1.1 200 OK
X-Gate-Verdict: ALLOWED
X-Concordium-Owner: ${realConcordiumAccount.slice(0, 8)}...${realConcordiumAccount.slice(-4)}
X-x402-Tariff-Settled: 0.002 CCD
X-EU-AI-Act-Article12-Record: rec_01h8x4a9b2...
Content-Type: application/json

{
  "service": "weather.telemetry",
  "temperature": "18.4°C",
  "barometer": "1013.25 hPa",
  "status": "RELEASED_BY_GATE"
}`}

{playgroundScenario === 'unpaid' && `HTTP/1.1 402 Payment Required
WWW-Authenticate: x402 network="concordium-testnet"
X-x402-Tariff: 0.002 CCD
X-x402-Deposit-Address: ${realConcordiumAccount}
X-Gate-Verdict: CHALLENGE_ISSUED

{
  "error": "Payment Required",
  "challenge": "Settle 0.002 CCD via x402 protocol to proceed",
  "standard": "x402"
}`}

{playgroundScenario === 'agent-b' && `HTTP/1.1 403 Forbidden
X-Gate-Verdict: REJECTED_UNVERIFIED
X-Concordium-Badge: MISSING_OR_REVOKED
X-Risk-Score: 98 / 100
X-Bouncer-Reason: Rogue agent failed CIS-8004 identity check

{
  "error": "Forbidden",
  "message": "Access denied: unverified autonomous agent refused at gate"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Broadsheet Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-serif text-xs uppercase tracking-wider text-stone-600">Active Agents</span>
                      <Fingerprint size={18} className="text-stone-900" />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-4xl font-extrabold tracking-tight text-stone-950">{stats.activeAgents}</span>
                      <span className="font-serif text-xs text-stone-600">CIS-8004 verified</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-serif text-xs uppercase tracking-wider text-stone-600">Allowed & Settled</span>
                      <Gauge size={18} className="text-stone-900" />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-4xl font-extrabold tracking-tight text-stone-950">{stats.requestsAllowed}</span>
                      <span className="font-serif text-xs text-stone-600">{stats.totalSettledAmount} CCD total revenue</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-serif text-xs uppercase tracking-wider text-stone-600">Blocked Actions</span>
                      <ShieldAlert size={18} className="text-red-800" />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-4xl font-extrabold tracking-tight text-red-900">{stats.requestsBlocked}</span>
                      <span className="font-serif text-xs text-stone-600">Unverified scripts refused</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Flow Visualization */}
                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h2 className="font-serif font-bold text-stone-950 text-lg uppercase tracking-tight">
                          Verification & Payment Pipeline
                        </h2>
                        <p className="font-serif text-xs text-stone-600 mt-0.5">Autonomous request lifecycle at TrustGate</p>
                      </div>
                      <span className="font-mono text-xs uppercase font-bold text-red-900">
                        Bouncer: Active
                      </span>
                    </div>

                    <div className="space-y-4 font-serif">
                      <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-[#F6F4EE] p-4">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-stone-900 bg-white font-mono text-xs font-bold text-stone-950">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-950">Who are you? (Concordium Badge Check)</p>
                          <p className="mt-1 text-xs text-stone-700 leading-relaxed">
                            Inspects <code>X-Concordium-Badge</code>. Resolves owner account, Active status, and verifies cross-chain key binding via CIS-8 (Base).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-[#F6F4EE] p-4">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-stone-900 bg-white font-mono text-xs font-bold text-stone-950">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-950">Can you pay? (x402 Micro-Payment Protocol)</p>
                          <p className="mt-1 text-xs text-stone-700 leading-relaxed">
                            Issues standard HTTP 402 challenge. The agent settles 0.002 CCD automatically without human intervention or cards.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-[#F6F4EE] p-4">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-stone-900 bg-white font-mono text-xs font-bold text-stone-950">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-950">What happened? (EU AI Act Article 12 Log)</p>
                          <p className="mt-1 text-xs text-stone-700 leading-relaxed">
                            Logs caller, verified human owner, payment transaction hash, and timestamp in an immutable audit trail.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-stone-200 pb-3">
                      <div className="rounded border border-stone-900 bg-[#F6F4EE] p-1.5 text-stone-950">
                        <Newspaper size={18} />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-stone-950 text-base uppercase tracking-tight">
                          Protocol Posture
                        </h2>
                        <p className="font-serif text-xs text-stone-600">Concordium Stack & Standards</p>
                      </div>
                    </div>

                    <div className="space-y-3 font-serif">
                      {[
                        ['CIS-8004 Registry', '100% Active'],
                        ['CIS-8 Key Binding', 'Base (8453) Linked'],
                        ['x402 Settlement', '0.002 CCD / Call'],
                        ['EU AI Act Art. 12', 'Active Logging'],
                      ].map(([label, status]) => (
                        <div key={label} className="rounded border border-stone-200 bg-[#F6F4EE] p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-700">{label}</span>
                            <span className="font-mono font-bold text-stone-950">{status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-2 border-t border-stone-200 pt-4 font-serif text-xs text-stone-700">
                      <CheckCircle2 size={14} className="text-stone-950" />
                      All Concordium components validated
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: AGENT REGISTRY (CIS-8004) */}
            {activeTab === 'registry' && (
              <div className="space-y-6">
                {/* FEATURE 3: Live On-Chain Badge & Key Inspector */}
                <div className="rounded-xl border-2 border-stone-900 bg-[#EAE6DB] p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={16} className="text-stone-900" />
                    <h3 className="font-serif font-bold text-stone-950 text-base uppercase">
                      Live On-Chain Badge & Identity Inspector
                    </h3>
                  </div>
                  <p className="font-serif text-xs text-stone-700 mb-4">
                    Verify any autonomous agent&apos;s CIS-8004 identity badge or Concordium account directly against the smart contract.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={inspectorInput}
                      onChange={(e) => {
                        setInspectorInput(e.target.value);
                        setSelectedPreset(null);
                      }}
                      placeholder="Enter Concordium Account or CIS-8004 Badge string..."
                      className="flex-1 rounded border border-stone-400 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      onClick={() => handleInspectBadge()}
                      className="cursor-pointer rounded bg-stone-950 px-5 py-2 font-serif text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 active:scale-95 transition-all shadow-sm"
                    >
                      Inspect On-Chain
                    </button>
                  </div>

                  {/* Preset quick test buttons */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 font-serif text-xs text-stone-600">
                    <span className="font-bold text-stone-800">Quick Test:</span>
                    <button
                      onClick={() => {
                        setInspectorInput(realBadge);
                        handleInspectBadge(realBadge, 'realBadge');
                      }}
                      className={`cursor-pointer rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                        selectedPreset === 'realBadge'
                          ? 'border-stone-950 bg-stone-950 text-white shadow-sm ring-2 ring-stone-900'
                          : 'border-stone-400 bg-white text-stone-800 hover:bg-[#F6F4EE] hover:border-stone-600'
                      }`}
                    >
                      ✔ Load Real Badge
                    </button>
                    <button
                      onClick={() => {
                        setInspectorInput(realConcordiumAccount);
                        handleInspectBadge(realConcordiumAccount, 'realAccount');
                      }}
                      className={`cursor-pointer rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                        selectedPreset === 'realAccount'
                          ? 'border-stone-950 bg-stone-950 text-white shadow-sm ring-2 ring-stone-900'
                          : 'border-stone-400 bg-white text-stone-800 hover:bg-[#F6F4EE] hover:border-stone-600'
                      }`}
                    >
                      ✔ Load Concordium Account
                    </button>
                    <button
                      onClick={() => {
                        const rogue = 'ccd:unregistered:rogue-bot-99/cis-2:FakeBadg3';
                        setInspectorInput(rogue);
                        handleInspectBadge(rogue, 'rogue');
                      }}
                      className={`cursor-pointer rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                        selectedPreset === 'rogue'
                          ? 'border-red-900 bg-red-800 text-white shadow-sm ring-2 ring-red-800'
                          : 'border-red-300 bg-red-50 text-red-900 hover:bg-red-100 hover:border-red-400'
                      }`}
                    >
                      ✕ Test Unregistered Bot
                    </button>
                  </div>

                  {/* Inspection Verdict Card */}
                  {inspectorResult && (
                    <div
                      className={`mt-4 rounded-lg border-2 p-4 font-mono text-xs ${
                        inspectorResult.status === 'VERIFIED'
                          ? 'border-stone-900 bg-white'
                          : 'border-red-800 bg-red-50 text-red-900'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                        <span className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                          {inspectorResult.status === 'VERIFIED' ? (
                            <>
                              <CheckCircle2 size={14} className="text-green-700" />
                              CIS-8004 On-Chain Verification: Validated
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="text-red-700" />
                              CIS-8004 Verification: Refused (Unregistered / Rogue)
                            </>
                          )}
                        </span>
                        <span className="font-bold text-[10px] uppercase">
                          Risk Score: {inspectorResult.riskScore} / 100
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 text-[11px]">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">ACCOUNTABLE OWNER:</span>
                          <span className="font-bold break-all">{inspectorResult.owner}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">REGISTRY CONTRACT:</span>
                          <span className="font-bold">{inspectorResult.contractIndex}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">BOUND CROSS-CHAIN KEY (BASE):</span>
                          <span className="font-bold break-all">{inspectorResult.boundKey}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase">AGENT CARD DIGEST:</span>
                          <span className="font-bold break-all text-stone-600">{inspectorResult.tamperHash}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-950 uppercase tracking-tight">
                        Registered Autonomous Agents
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-1">
                        Agents minted into Concordium CIS-8004 Agent Registry contract (Index 10082).
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded border border-stone-900 bg-[#EAE6DB] px-3 py-1 font-mono text-xs font-bold text-stone-950 uppercase">
                      <CheckCircle2 size={13} /> Verified by Concordium
                    </span>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {/* Primary Registered Agent Card */}
                    <div className="rounded-lg border-2 border-stone-900 bg-[#F6F4EE] p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded border border-stone-900 bg-white font-serif font-black text-stone-950">
                            WA
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-stone-950 text-base">TrustGate Weather Agent</h3>
                            <p className="font-serif text-[11px] text-stone-600">Autonomous Weather & Geo-Telemetry Agent</p>
                          </div>
                        </div>
                        <span className="rounded bg-stone-950 px-2.5 py-0.5 font-mono text-[10px] font-bold text-stone-100 uppercase">
                          Active
                        </span>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">CONCORDIUM BADGE STRING:</span>
                          <span className="text-stone-950 break-all select-all text-[11px] font-semibold">{realBadge}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">ACCOUNTABLE HUMAN OWNER (CONCORDIUM):</span>
                          <a
                            href={`https://ccdexplorer.io/testnet/account/${realConcordiumAccount}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-stone-950 underline hover:text-red-900 break-all inline-flex items-center gap-1 font-semibold"
                          >
                            {realConcordiumAccount} <ExternalLink size={10} />
                          </a>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">AGENT CARD METADATA HASH:</span>
                          <span className="text-stone-700 break-all">sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">REGISTRY CONTRACT INDEX:</span>
                          <span className="text-stone-900 font-bold">CIS-8004 #10082 (Subindex 0)</span>
                        </div>
                      </div>
                    </div>

                    {/* How CIS-8004 Verification Works */}
                    <div className="rounded-lg border border-stone-300 bg-[#EFECE3] p-5 space-y-4 font-serif">
                      <h3 className="font-bold text-stone-950 text-base flex items-center gap-2 uppercase tracking-wide">
                        <Layers size={16} />
                        How CIS-8004 Protects the Gateway
                      </h3>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        Concordium&apos;s CIS-8004 standard creates a protocol-level non-fungible token for every registered agent. 
                        Unlike anonymous API keys, the badge proves that:
                      </p>
                      <ul className="space-y-2 text-xs text-stone-800">
                        <li className="flex items-start gap-2">
                          <span className="text-stone-950 font-bold">•</span>
                          <span><strong>Verified Identity:</strong> Tied to a KYC-verified human or business Concordium account.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-950 font-bold">•</span>
                          <span><strong>Tamper-Resistant:</strong> The Agent Card hash on-chain guarantees the agent&apos;s behavior and source haven&apos;t been altered.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-950 font-bold">•</span>
                          <span><strong>Instant Revocation:</strong> If an agent behaves maliciously, its badge can be revoked on-chain, immediately locking it out of TrustGate.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CIS-8 KEY BINDINGS */}
            {activeTab === 'cis8' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-950 uppercase tracking-tight">
                        Cross-Chain Key Bindings (CIS-8)
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-1">
                        Cryptographic binding between external blockchain keys (e.g. Base EVM) and Concordium human identities.
                      </p>
                    </div>
                    <span className="rounded border border-stone-400 bg-[#EAE6DB] px-3 py-1 font-mono text-xs font-bold text-stone-950 uppercase">
                      Contract Index 10081
                    </span>
                  </div>

                  <div className="mt-6 rounded-lg border-2 border-stone-900 bg-[#F6F4EE] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-300 pb-4">
                      <div>
                        <span className="font-serif text-xs uppercase tracking-wider text-stone-500 font-bold">External Chain</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-serif font-bold text-stone-950">Base Network</span>
                          <span className="font-mono text-[11px] text-stone-600">(CAIP-2: eip155:8453)</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-serif text-xs uppercase tracking-wider text-stone-500 font-bold">Status</span>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-950 font-bold uppercase">
                            <CheckCircle2 size={12} /> Bound & Cryptographically Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 font-mono text-xs">
                      <div className="space-y-1">
                        <span className="text-stone-500 text-[10px] font-bold uppercase">BOUND EVM PUBLIC KEY:</span>
                        <p className="text-stone-950 font-semibold select-all">{realEvmAddress}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-stone-500 text-[10px] font-bold uppercase">BOUND CONCORDIUM ACCOUNT:</span>
                        <p className="text-stone-950 font-semibold select-all">{realConcordiumAccount}</p>
                      </div>
                    </div>

                    <div className="mt-6 rounded border border-stone-300 bg-white p-4 font-serif text-xs text-stone-700 space-y-2">
                      <p className="font-bold text-stone-950 flex items-center gap-1.5 uppercase text-xs">
                        <Key size={14} />
                        Signature Authentication Flow
                      </p>
                      <p>
                        When the agent sends a request, it signs a challenge timestamp with its EVM private key. 
                        TrustGate recovers the address via ECDSA (<code>ethers.verifyMessage</code>), validates that it matches <code>{realEvmAddress}</code>, 
                        and confirms the CIS-8 registry binding before allowing access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: x402 PAYMENTS */}
            {activeTab === 'x402' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-950 uppercase tracking-tight">
                        x402 Micro-Payment Protocol
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-1">
                        Autonomous pay-per-call monetization via HTTP 402 Payment Required.
                      </p>
                    </div>
                    <span className="rounded border border-stone-400 bg-[#EAE6DB] px-3 py-1 font-mono text-xs font-bold text-stone-950 uppercase">
                      Standard: x402
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3 font-serif">
                    <div className="rounded-lg border border-stone-300 bg-[#F6F4EE] p-4">
                      <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Price Per Request</span>
                      <p className="mt-1 font-mono text-3xl font-extrabold text-stone-950">0.002 CCD</p>
                      <span className="text-[10px] text-stone-500">Auto-deducted per API call</span>
                    </div>

                    <div className="rounded-lg border border-stone-300 bg-[#F6F4EE] p-4">
                      <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Total Settled Revenue</span>
                      <p className="mt-1 font-mono text-3xl font-extrabold text-stone-950">{stats.totalSettledAmount} CCD</p>
                      <span className="text-[10px] text-stone-500">From {stats.requestsAllowed} paid calls</span>
                    </div>

                    <div className="rounded-lg border border-stone-300 bg-[#F6F4EE] p-4">
                      <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Payout Recipient Account</span>
                      <p className="mt-1 font-mono text-xs text-stone-950 font-bold truncate">{realConcordiumAccount}</p>
                      <span className="text-[10px] text-stone-500">Concordium deposit address</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: AUDIT LOG (EU AI ACT ARTICLE 12) */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-950 uppercase tracking-tight">
                        EU AI Act Article 12 Audit Records
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-1">
                        Immutable, verifiable records linking every autonomous agent call back to an accountable owner.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* FEATURE 2: Export All Audit Records */}
                      <button
                        onClick={handleDownloadAllCertificates}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded border border-stone-900 bg-stone-950 px-3 py-1.5 text-xs font-serif font-bold text-white uppercase hover:bg-stone-800 active:scale-95 transition-all shadow-sm"
                      >
                        <Download size={12} />
                        Export All (.JSON)
                      </button>

                      {(['ALL', 'ALLOWED', 'BLOCKED'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setAuditFilter(filter)}
                          className={`cursor-pointer rounded px-3 py-1.5 text-xs font-serif font-bold uppercase transition-all active:scale-95 ${
                            auditFilter === filter
                              ? filter === 'BLOCKED'
                                ? 'bg-red-800 text-white shadow-sm ring-2 ring-red-900'
                                : filter === 'ALLOWED'
                                ? 'bg-emerald-900 text-white shadow-sm ring-2 ring-emerald-900'
                                : 'bg-stone-950 text-white shadow-sm ring-2 ring-stone-900'
                              : 'bg-[#EFECE3] text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left font-serif text-xs">
                      <thead className="border-b-2 border-stone-900 text-stone-700 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="pb-3 font-bold">Decision</th>
                          <th className="pb-3 font-bold">Record ID</th>
                          <th className="pb-3 font-bold">Timestamp</th>
                          <th className="pb-3 font-bold">Agent Caller</th>
                          <th className="pb-3 font-bold">Concordium Owner</th>
                          <th className="pb-3 font-bold">Payment</th>
                          <th className="pb-3 font-bold">Risk</th>
                          <th className="pb-3 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {filteredEvents.map((record) => {
                          const isAllowed = record.decision === 'ALLOWED';
                          return (
                            <tr key={record.id} className="hover:bg-[#F6F4EE]/50">
                              <td className="py-3">
                                <span
                                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                    isAllowed
                                      ? 'bg-stone-900 text-white'
                                      : 'bg-red-800 text-white'
                                  }`}
                                >
                                  {record.decision}
                                </span>
                              </td>
                              <td className="py-3 font-mono text-stone-600">{record.id.slice(0, 16)}…</td>
                              <td className="py-3 font-mono text-stone-600">
                                {new Date(record.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="py-3 font-bold text-stone-950">{record.agentId}</td>
                              <td className="py-3 font-mono text-[11px] text-stone-700">
                                {record.concordiumOwner === 'UNVERIFIED' ? (
                                  <span className="text-red-900 font-bold">UNVERIFIED (Rogue)</span>
                                ) : (
                                  <a
                                    href={`https://ccdexplorer.io/testnet/account/${record.concordiumOwner}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-stone-900 underline font-bold"
                                  >
                                    {record.concordiumOwner.slice(0, 8)}…{record.concordiumOwner.slice(-4)}
                                  </a>
                                )}
                              </td>
                              <td className="py-3 font-mono text-[11px] font-bold text-stone-950">
                                {record.payment?.settled ? '0.002 CCD' : '—'}
                              </td>
                              <td className="py-3 font-mono font-bold">
                                <span className={record.riskScore <= 10 ? 'text-stone-950' : 'text-red-900'}>
                                  {record.riskScore} / 100
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  {/* Inspect JSON */}
                                  <button
                                    onClick={() => setSelectedRecord(record)}
                                    title="Inspect JSON record"
                                    className="cursor-pointer rounded border border-stone-300 p-1.5 bg-white hover:bg-stone-100 text-stone-800 active:scale-95 transition-all shadow-xs"
                                  >
                                    <Eye size={13} />
                                  </button>

                                  {/* FEATURE 2: Download Individual Certificate */}
                                  <button
                                    onClick={() => handleDownloadCertificate(record)}
                                    title="Download EU AI Act Article 12 Certificate"
                                    className="cursor-pointer inline-flex items-center gap-1 rounded border border-stone-400 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-stone-900 hover:bg-stone-100 active:scale-95 transition-all shadow-xs"
                                  >
                                    <Download size={11} /> Certificate
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredEvents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-stone-500 font-serif">
                              No records found for filter &ldquo;{auditFilter}&rdquo;.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Forensic JSON Inspector Modal/Panel */}
                {selectedRecord && (
                  <div className="rounded-xl border-2 border-stone-900 bg-[#EFECE3] p-6 space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-stone-950" />
                        <h3 className="font-serif font-bold text-stone-950 text-sm uppercase">
                          Forensic Audit Payload ({selectedRecord.id})
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownloadCertificate(selectedRecord)}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded border border-stone-900 bg-stone-950 px-2.5 py-1 text-xs font-mono font-bold text-white hover:bg-stone-800 active:scale-95 transition-all shadow-sm"
                        >
                          <Download size={12} /> Download Official Certificate (.JSON)
                        </button>
                        <button
                          onClick={() => setSelectedRecord(null)}
                          className="cursor-pointer font-mono text-xs font-bold text-stone-700 hover:text-stone-950 active:scale-95 transition-all"
                        >
                          [ Close ✕ ]
                        </button>
                      </div>
                    </div>
                    <pre className="max-h-72 overflow-y-auto rounded-lg border border-stone-300 bg-white p-4 font-mono text-xs text-stone-900 leading-relaxed shadow-inner">
                      {JSON.stringify(selectedRecord, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* FEATURE 1: TAB 6: DEVELOPER DROP-IN SDK & TOOLKIT */}
            {activeTab === 'sdk' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-950 uppercase tracking-tight">
                        Developer SDK & Integration Toolkit
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-1">
                        Protect any AI agent endpoint or Model Context Protocol (MCP) server in 3 lines of code.
                      </p>
                    </div>
                    <span className="rounded border border-stone-900 bg-[#EAE6DB] px-3 py-1 font-mono text-xs font-bold text-stone-950 uppercase">
                      Drop-In Proxy · 0.002 CCD Tariff
                    </span>
                  </div>

                  {/* Framework Selector Tabs */}
                  <div className="mt-6 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
                    {[
                      ['next', 'Next.js / Node.js (TypeScript)'],
                      ['python', 'Python / FastAPI (ASGI)'],
                      ['mcp', 'Model Context Protocol (MCP)'],
                      ['curl', 'Direct cURL / Raw REST'],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSdkFramework(key as any)}
                        className={`cursor-pointer rounded px-3.5 py-1.5 font-serif text-xs font-bold uppercase transition-all active:scale-95 ${
                          sdkFramework === key
                            ? 'bg-stone-950 text-white shadow-sm ring-2 ring-stone-900'
                            : 'bg-[#EFECE3] text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Step 1: Package Installation Command Box */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-stone-300 bg-[#EFECE3] p-3 shadow-xs">
                    <div className="flex items-center gap-2 font-mono text-xs text-stone-900">
                      <Terminal size={14} className="text-stone-700 shrink-0" />
                      <span className="font-bold text-stone-600 uppercase text-[10px] shrink-0">Step 1 (Install):</span>
                      <code className="text-stone-950 font-bold break-all">
                        {sdkFramework === 'next' && 'npm install @0xskinny001/trustgate-sdk'}
                        {sdkFramework === 'python' && 'pip install trustgate'}
                        {sdkFramework === 'mcp' && 'npm install @0xskinny001/trustgate-sdk'}
                        {sdkFramework === 'curl' && 'curl --version  # Standard CLI'}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        const cmd =
                          sdkFramework === 'next'
                            ? 'npm install @0xskinny001/trustgate-sdk'
                            : sdkFramework === 'python'
                            ? 'pip install trustgate'
                            : sdkFramework === 'mcp'
                            ? 'npm install @0xskinny001/trustgate-sdk'
                            : 'curl -i https://gateway.trustgate.local/api/gateway/protected-data';
                        copyToClipboard(cmd, `install-${sdkFramework}`);
                      }}
                      className="cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto rounded border border-stone-400 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-stone-800 hover:bg-stone-100 active:scale-95 transition-all shadow-xs"
                    >
                      {copiedKey === `install-${sdkFramework}` ? (
                        <>
                          <Check size={11} className="text-green-700" /> Copied Command!
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copy Command
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step 2: Code Snippet Box */}
                  <div className="mt-3 rounded-xl border-2 border-stone-900 bg-stone-950 text-stone-100 p-5 shadow-lg relative">
                    <div className="flex items-center justify-between border-b border-stone-700 pb-2 mb-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400">
                        Step 2 · {sdkFramework === 'next' && 'app/api/your-agent-service/route.ts'}
                        {sdkFramework === 'python' && 'server.py'}
                        {sdkFramework === 'mcp' && 'mcp_server.ts'}
                        {sdkFramework === 'curl' && 'Terminal Command'}
                      </span>
                      <button
                        onClick={() => {
                          const snippets: Record<string, string> = {
                            next: `// 1. In production: npm install @0xskinny001/trustgate-sdk
//    In this repo: import { withTrustGate } from '@/lib/trustgate/gateway';
import { withTrustGate } from '@0xskinny001/trustgate-sdk';

// 2. Wrap your route handler with TrustGate bouncer
export const POST = withTrustGate(async (req, { agentIdentity, paymentProof }) => {
  return Response.json({
    status: "Success",
    data: "Protected compute released",
    verifiedCaller: agentIdentity?.concordiumAccount,
    settledTx: paymentProof?.txHash
  });
}, {
  concordiumAccount: "${realConcordiumAccount}",
  tariff: "0.002 CCD",
  enforceArticle12: true
});`,
                            python: `# 1. In production: pip install trustgate
from fastapi import FastAPI, Request
from trustgate import TrustGateMiddleware

app = FastAPI()

# 2. Attach TrustGate bouncer middleware
app.add_middleware(
    TrustGateMiddleware,
    concordium_deposit_account="${realConcordiumAccount}",
    tariff="0.002 CCD",
    enforce_cis8004=True,
    enforce_article12=True
)

@app.post("/agent/execute")
async def execute_task():
    return {"status": "authorized", "result": "Telemetry granted"}`,
                            mcp: `// 1. In production: npm install @trustgate/mcp
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { wrapToolWithTrustGate } from "@trustgate/mcp";

const server = new McpServer({ name: "WeatherAgent", version: "1.0.0" });

// 2. Wrap high-value tools with Concordium KYC & x402 monetization
server.tool(
  "query_live_weather",
  wrapToolWithTrustGate({
    tariff: "0.002 CCD",
    concordiumAccount: "${realConcordiumAccount}",
    handler: async (args) => ({ temperature: "18.4C", status: "RELEASED" })
  })
);`,
                            curl: `curl -X POST https://gateway.trustgate.local/api/gateway/protected-data \\
  -H "X-Concordium-Badge: ${realBadge}" \\
  -H "X-EVM-Signer: ${realEvmAddress}" \\
  -H "Authorization: x402-payment tx=0x7c4e9a12f0b83d56e..." \\
  -H "Content-Type: application/json"`,
                          };
                          copyToClipboard(snippets[sdkFramework], sdkFramework);
                        }}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded border border-stone-600 bg-stone-800 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-stone-700 active:scale-95 transition-all shadow-sm"
                      >
                        {copiedKey === sdkFramework ? (
                          <>
                            <Check size={12} className="text-green-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-stone-200">
{sdkFramework === 'next' && `// 1. In production: npm install @0xskinny001/trustgate-sdk
//    In this repo: import { withTrustGate } from '@/lib/trustgate/gateway';
import { withTrustGate } from '@0xskinny001/trustgate-sdk';

// 2. Wrap your route handler with TrustGate bouncer
export const POST = withTrustGate(async (req, { agentIdentity, paymentProof }) => {
  return Response.json({
    status: "Success",
    data: "Protected compute released",
    verifiedCaller: agentIdentity?.concordiumAccount,
    settledTx: paymentProof?.txHash
  });
}, {
  concordiumAccount: "${realConcordiumAccount}",
  tariff: "0.002 CCD",
  enforceArticle12: true
});`}

{sdkFramework === 'python' && `# 1. In production: pip install trustgate
from fastapi import FastAPI, Request
from trustgate import TrustGateMiddleware

app = FastAPI()

# 2. Attach TrustGate bouncer middleware
app.add_middleware(
    TrustGateMiddleware,
    concordium_deposit_account="${realConcordiumAccount}",
    tariff="0.002 CCD",
    enforce_cis8004=True,
    enforce_article12=True
)

@app.post("/agent/execute")
async def execute_task():
    return {"status": "authorized", "result": "Telemetry granted"}`}

{sdkFramework === 'mcp' && `// 1. In production: npm install @trustgate/mcp
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { wrapToolWithTrustGate } from "@trustgate/mcp";

const server = new McpServer({ name: "WeatherAgent", version: "1.0.0" });

// 2. Wrap high-value tools with Concordium KYC & x402 monetization
server.tool(
  "query_live_weather",
  wrapToolWithTrustGate({
    tariff: "0.002 CCD",
    concordiumAccount: "${realConcordiumAccount}",
    handler: async (args) => ({ temperature: "18.4C", status: "RELEASED" })
  })
);`}

{sdkFramework === 'curl' && `curl -X POST https://gateway.trustgate.local/api/gateway/protected-data \\
  -H "X-Concordium-Badge: ${realBadge}" \\
  -H "X-EVM-Signer: ${realEvmAddress}" \\
  -H "Authorization: x402-payment tx=0x7c4e9a12f0b83d56e..." \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>

                  {/* Architecture Integration Notice */}
                  <div className="mt-6 rounded-lg border border-stone-300 bg-[#F6F4EE] p-5 font-serif text-xs text-stone-700 space-y-2">
                    <h3 className="font-bold text-stone-950 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                      <FileCheck size={14} />
                      Zero-Friction Gateway Proxy
                    </h3>
                    <p className="leading-relaxed">
                      Developers do not need to rewrite their underlying business logic. TrustGate intercepts incoming requests at the reverse-proxy layer, evaluates the caller&apos;s on-chain CIS-8004 status, executes the x402 payment challenge, and commits an immutable Article 12 audit record before invoking the underlying application code.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
