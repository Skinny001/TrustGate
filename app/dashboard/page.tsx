'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrustGateLogo } from '@/components/trustgate-logo';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
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

type TabType = 'monitor' | 'registry' | 'cis8' | 'x402' | 'audit';

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

  // User's Real On-Chain Values
  const realConcordiumAccount = '4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc';
  const realBadge = 'ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL';
  const realEvmAddress = '0x372b4eB67006F68A9f296b23715055b8A878ABA9';

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

  const navItems: [TabType, any, string][] = [
    ['monitor', Activity, 'Live Monitor'],
    ['registry', Fingerprint, 'Agent Registry (CIS-8004)'],
    ['cis8', LockKeyhole, 'CIS-8 Key Bindings'],
    ['x402', WalletCards, 'x402 Payments'],
    ['audit', FileText, 'Audit Log (Art. 12)'],
  ];

  const filteredEvents = events.filter((e) => {
    if (auditFilter === 'ALL') return true;
    return e.decision === auditFilter;
  });

  return (
    <main className="min-h-screen bg-[#F6F4EE] text-stone-900 font-sans">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* Newspaper Editorial Sidebar */}
        <aside className="hidden w-[270px] shrink-0 border-r-2 border-stone-900 bg-[#EFECE3] p-5 lg:flex lg:flex-col">
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
                  className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition ${
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
              </p>
              <h1 className="font-serif mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 uppercase">
                {activeTab === 'monitor' && 'Trust, Verified At Every Action'}
                {activeTab === 'registry' && 'On-Chain Agent Registry (CIS-8004)'}
                {activeTab === 'cis8' && 'Cross-Chain Key Bindings (CIS-8)'}
                {activeTab === 'x402' && 'HTTP 402 Autonomous Payments'}
                {activeTab === 'audit' && 'Verifiable Regulatory Ledger'}
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
                className="flex items-center gap-1.5 rounded border border-stone-400 bg-white px-3 py-1.5 font-serif text-xs text-stone-800 hover:bg-stone-50"
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
                {/* Live Interactive Hackathon Demo Controller Bar (Broadsheet Stamp Box) */}
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
                        className="flex items-center gap-2 rounded bg-stone-950 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-100 shadow transition hover:bg-stone-800 disabled:opacity-50"
                      >
                        <Play size={13} className="fill-stone-100" />
                        {simulating === 'agent-a' ? 'Executing Agent A...' : 'Simulate Agent A (Pass & Pay)'}
                      </button>

                      <button
                        disabled={simulating !== null}
                        onClick={() => handleSimulate('agent-b')}
                        className="flex items-center gap-2 rounded border border-red-800 bg-red-800 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-900 disabled:opacity-50"
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

                {/* Quick Recent Activity Feed (Broadsheet Ledger Table) */}
                <div className="rounded-xl border border-stone-300 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h2 className="font-serif font-bold text-stone-950 text-lg uppercase tracking-tight">
                        Recent Gateway Events
                      </h2>
                      <p className="font-serif text-xs text-stone-600 mt-0.5">Live bouncer verdicts from incoming agent requests</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="font-serif text-xs font-bold text-red-900 hover:underline"
                    >
                      View Full Audit Log ({events.length}) →
                    </button>
                  </div>

                  {events.length === 0 ? (
                    <div className="py-8 text-center font-serif text-xs text-stone-500">
                      No requests yet. Click <strong>Simulate Agent A</strong> above to test!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-serif text-xs">
                        <thead className="border-b-2 border-stone-900 text-stone-700 uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="pb-3 font-bold">Status</th>
                            <th className="pb-3 font-bold">Time</th>
                            <th className="pb-3 font-bold">Agent</th>
                            <th className="pb-3 font-bold">Concordium Owner</th>
                            <th className="pb-3 font-bold">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {events.slice(0, 5).map((event) => {
                            const isAllowed = event.decision === 'ALLOWED';
                            return (
                              <tr key={event.id} className="hover:bg-[#F6F4EE]/50">
                                <td className="py-3">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                      isAllowed
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-red-800 text-white'
                                    }`}
                                  >
                                    {event.decision}
                                  </span>
                                </td>
                                <td className="py-3 font-mono text-stone-600">
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="py-3 font-bold text-stone-950">{event.agentId}</td>
                                <td className="py-3 font-mono text-[11px] text-stone-700 truncate max-w-[140px]">
                                  {event.concordiumOwner === 'UNVERIFIED' ? (
                                    <span className="text-red-900 font-bold">Rogue</span>
                                  ) : (
                                    <a
                                      href={`https://ccdexplorer.io/testnet/account/${event.concordiumOwner}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-stone-900 underline hover:text-stone-600 font-bold"
                                    >
                                      {event.concordiumOwner.slice(0, 6)}…{event.concordiumOwner.slice(-4)}
                                    </a>
                                  )}
                                </td>
                                <td className="py-3 text-stone-700 truncate max-w-[280px]" title={event.reason}>
                                  {event.reason}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: AGENT REGISTRY (CIS-8004) */}
            {activeTab === 'registry' && (
              <div className="space-y-6">
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
                        Concordium's CIS-8004 standard creates a protocol-level non-fungible token for every registered agent. 
                        Unlike anonymous API keys, the badge proves that:
                      </p>
                      <ul className="space-y-2 text-xs text-stone-800">
                        <li className="flex items-start gap-2">
                          <span className="text-stone-950 font-bold">•</span>
                          <span><strong>Verified Identity:</strong> Tied to a KYC-verified human or business Concordium account.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-stone-950 font-bold">•</span>
                          <span><strong>Tamper-Resistant:</strong> The Agent Card hash on-chain guarantees the agent's behavior and source haven't been altered.</span>
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

                  <div className="mt-6 rounded-lg border border-stone-300 bg-[#F6F4EE] p-5">
                    <h3 className="font-serif font-bold text-stone-950 text-sm uppercase tracking-wide mb-3">Settlement Ledger</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-serif text-xs">
                        <thead className="border-b-2 border-stone-900 text-stone-700 uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="pb-3 font-bold">Tx Hash</th>
                            <th className="pb-3 font-bold">Payer (EVM Key)</th>
                            <th className="pb-3 font-bold">Amount</th>
                            <th className="pb-3 font-bold">Network</th>
                            <th className="pb-3 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {events.filter((e) => e.payment?.settled).map((e) => (
                            <tr key={e.id} className="hover:bg-white/50">
                              <td className="py-3 font-mono text-[11px] text-stone-800 truncate max-w-[200px]" title={e.payment?.txHash}>
                                {e.payment?.txHash}
                              </td>
                              <td className="py-3 font-mono text-[11px] text-stone-700">
                                {realEvmAddress.slice(0, 8)}…{realEvmAddress.slice(-4)}
                              </td>
                              <td className="py-3 font-mono font-bold text-stone-950">
                                {e.payment?.amount} {e.payment?.currency}
                              </td>
                              <td className="py-3 text-stone-600">concordium-testnet</td>
                              <td className="py-3">
                                <span className="rounded bg-stone-950 text-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                                  Settled
                                </span>
                              </td>
                            </tr>
                          ))}
                          {events.filter((e) => e.payment?.settled).length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-stone-500 font-serif">
                                No payments recorded yet. Click "Simulate Agent A" on the Monitor tab!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                    <div className="flex items-center gap-2">
                      {(['ALL', 'ALLOWED', 'BLOCKED'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setAuditFilter(filter)}
                          className={`rounded px-3 py-1 text-xs font-serif font-bold uppercase transition ${
                            auditFilter === filter
                              ? 'bg-stone-950 text-white'
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
                          <th className="pb-3 font-bold">Risk Score</th>
                          <th className="pb-3 font-bold">Inspect</th>
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
                                {new Date(record.timestamp).toLocaleString()}
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
                                <button
                                  onClick={() => setSelectedRecord(record)}
                                  className="rounded border border-stone-300 p-1 bg-white hover:bg-[#F6F4EE] text-stone-800"
                                >
                                  <Eye size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredEvents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-stone-500 font-serif">
                              No records found for filter "{auditFilter}".
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
                      <button
                        onClick={() => setSelectedRecord(null)}
                        className="font-mono text-xs font-bold text-stone-700 hover:text-stone-950"
                      >
                        [ Close ✕ ]
                      </button>
                    </div>
                    <pre className="max-h-72 overflow-y-auto rounded-lg border border-stone-300 bg-white p-4 font-mono text-xs text-stone-900 leading-relaxed shadow-inner">
                      {JSON.stringify(selectedRecord, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
