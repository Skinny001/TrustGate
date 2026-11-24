'use client';

import Link from 'next/link';
import { TrustGateLogo } from '@/components/trustgate-logo';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  Gauge,
  Key,
  Layers,
  LockKeyhole,
  Newspaper,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Stamp,
  Terminal,
  WalletCards,
  XCircle,
} from 'lucide-react';

export default function LandingPage() {
  const realConcordiumAccount = '4Qpfc7LiNCYQQUpVFmbRg6gaoCCfvuAQTqE4VC4XDE22moedYc';
  const realBadge = 'ccd:4221332d34e1694168c2a0c0b3fd0f27/cis-2:JyP9U4GmLT6BJ2egEfmgL';
  const realEvmAddress = '0x372b4eB67006F68A9f296b23715055b8A878ABA9';

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-stone-900 selection:bg-stone-800 selection:text-stone-100 font-sans">
      {/* Top Newspaper Masthead Strip */}
      <div className="border-b border-stone-300 bg-[#EFECE3] px-4 py-1.5 text-center text-[11px] font-serif tracking-wider text-stone-700 flex flex-wrap items-center justify-center gap-2">
        <span className="font-semibold uppercase">Encode Club × Concordium Trusted Agents Hackathon</span>
        <span className="text-stone-400">·</span>
        <a
          href="https://www.npmjs.com/package/@0xskinny001/trustgate-sdk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-red-900 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full hover:bg-red-800 hover:text-white transition"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-800" />
          npm: @0xskinny001/trustgate-sdk (v1.0.1) <ExternalLink size={9} />
        </a>
        <span className="text-stone-400">·</span>
        <Link href="/dashboard" className="font-semibold underline hover:text-stone-900 ml-1 inline-flex items-center gap-1">
          Launch Control Plane <ArrowRight size={11} />
        </Link>
      </div>

      {/* Main Newspaper Header / Front Page Masthead */}
      <header className="border-b-2 border-stone-900 bg-[#F6F4EE]">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-2">
              <TrustGateLogo size={68} />
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl font-black tracking-tight text-stone-950 uppercase py-1 border-y-2 border-stone-900 my-2 w-full max-w-4xl">
              TrustGate
            </h1>

            <p className="font-serif italic text-sm sm:text-base text-stone-700 mt-2 max-w-xl">
              "An accountable gateway ensuring every autonomous agent is bound to a verified human owner, charged per call, and entered into public record."
            </p>
          </div>

          {/* Sub-Navigation Strip (Classic Broadsheet Rule) */}
          <div className="mt-6 flex flex-wrap items-center justify-between border-t border-b border-stone-800 py-2.5 text-xs font-serif uppercase tracking-wider text-stone-800">
            <div className="flex items-center gap-6">
              <a href="#dispatch" className="hover:text-stone-950 hover:underline">Front Page</a>
              <a href="#demo-broadcast" className="hover:text-stone-950 hover:underline">Watch Demo</a>
              <a href="#pipeline" className="hover:text-stone-950 hover:underline">The 3 Checks</a>
              <a href="#standards" className="hover:text-stone-950 hover:underline">Concordium Stack</a>
              <a
                href={`https://ccdexplorer.io/testnet/account/${realConcordiumAccount}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-950 inline-flex items-center gap-1 text-red-900 font-semibold"
              >
                On-Chain Registry <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <a
                href="https://www.npmjs.com/package/@0xskinny001/trustgate-sdk"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded border border-stone-400 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-stone-900 hover:bg-stone-100 transition"
              >
                npm package <ExternalLink size={10} />
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded bg-stone-950 px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#F6F4EE] hover:bg-stone-800 transition"
              >
                Launch App <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Front Page Broadsheet Columns */}
      <section id="dispatch" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Headline & Lead Article (8 Cols) */}
          <div className="lg:col-span-8 lg:border-r lg:border-stone-300 lg:pr-8 space-y-6">
            <div className="border-b border-stone-300 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-red-800 font-bold">
                [ SPECIAL REPORT · PROTOCOL VERIFICATION ]
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight mt-1">
                The Automated Bouncer for Autonomous AI Agents
              </h2>
              <p className="font-serif text-lg text-stone-700 italic mt-2">
                Concordium identity registry, x402 payment settlement, and Article 12 compliance converge into one single drop-in gateway.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 text-stone-800 text-sm leading-relaxed font-serif">
              <div className="space-y-4">
                <p className="first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-stone-950">
                  As autonomous AI agents begin navigating web services on their own, application programming interfaces (APIs) face an unprecedented liability crisis. Service providers are incapable of proving whether an incoming request stems from a reputable business or an anonymous rogue bot.
                </p>
                <p>
                  Credit cards and traditional billing portals fail completely for machines. Furthermore, emerging statutes like Article 12 of the European Union AI Act strictly mandate that automated actions possess a verifiable trail back to an accountable legal owner.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  <strong>TrustGate</strong> solves this tri-fold dilemma by acting as an impartial gatekeeper. Sitting in front of any paid API endpoint, it executes three immutable checks before a single byte of protected telemetry or data is released to the caller.
                </p>
                <div className="rounded-lg border-2 border-stone-900 bg-[#EFECE3] p-4 text-xs font-mono space-y-2">
                  <div className="font-bold text-stone-950 uppercase border-b border-stone-400 pb-1">
                    Live Broadsheet Dispatch
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">On-Chain Badge:</span>
                    <span className="text-stone-900 font-semibold truncate max-w-[160px]">{realBadge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Concordium Owner:</span>
                    <span className="text-stone-900 font-semibold truncate max-w-[160px]">{realConcordiumAccount.slice(0, 8)}…</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Cross-Chain Key:</span>
                    <span className="text-stone-900 font-semibold">Base (0x372b…ABA9)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Action Box */}
            <div className="rounded-xl border-2 border-stone-950 bg-[#EAE6DB] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 mt-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-950">Inspect the Live Gateway System</h3>
                <p className="text-xs text-stone-600 font-serif mt-1">
                  Run the live dual-agent simulation, view cryptographic proofs, and browse the Article 12 audit ledger.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="mt-4 sm:mt-0 shrink-0 inline-flex items-center gap-2 rounded bg-stone-950 px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-stone-100 hover:bg-stone-800 transition shadow"
              >
                Launch Control Plane <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Sidebar Column (4 Cols - Broadsheet Style) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Stamp Box */}
            <div className="rounded-xl border border-stone-400 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-stone-500">Official Seal</span>
                <span className="rounded bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <TrustGateLogo size={46} />
                <div>
                  <h4 className="font-serif font-bold text-stone-950">Verified by Concordium</h4>
                  <p className="text-[11px] text-stone-600 font-serif">CIS-8004 Registry Token #10082</p>
                </div>
              </div>

              <p className="text-xs font-serif text-stone-700 leading-relaxed border-t border-stone-200 pt-3">
                Autonomous agents are cryptographically backed by Zero-Knowledge identity on Concordium without publishing sensitive personal data.
              </p>
            </div>

            {/* Sidebar Editorial Feature: The Problem vs Solution */}
            <div className="rounded-xl border border-stone-300 bg-[#EFECE3] p-5 space-y-4">
              <h4 className="font-serif font-bold text-stone-950 uppercase tracking-wide text-xs border-b border-stone-400 pb-2">
                Case Comparison
              </h4>

              <div className="space-y-3 text-xs font-serif">
                <div className="border-l-2 border-red-700 pl-3">
                  <p className="font-bold text-red-900 uppercase text-[10px]">Anonymous Bots (Without Gate)</p>
                  <p className="text-stone-700 mt-0.5">Unaccountable scraping, forged headers, unpaid queries, and regulatory liability.</p>
                </div>

                <div className="border-l-2 border-stone-900 pl-3">
                  <p className="font-bold text-stone-950 uppercase text-[10px]">TrustGate Protected (With Gate)</p>
                  <p className="text-stone-700 mt-0.5">Verified human ownership, 0.002 CCD automatic settlement, and full Article 12 accountability.</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Column */}
            <div className="border-t-2 border-b-2 border-stone-900 py-4 font-serif text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-600 block">Settlement Rate</span>
              <span className="text-3xl font-black text-stone-950 font-mono">0.002 CCD</span>
              <span className="text-xs text-stone-600 block italic">Per API Transaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demonstration Section */}
      <section id="demo-broadcast" className="border-t-2 border-stone-900 bg-[#EFECE3] py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-red-900 font-bold">
              [ AUDIOVISUAL DISPATCH · BROADCAST ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-950 uppercase tracking-tight mt-1">
              Watch TrustGate In Action
            </h2>
            <p className="font-serif text-sm text-stone-700 italic mt-2">
              A complete walkthrough of autonomous verification, x402 payment settlement, and Article 12 compliance.
            </p>
            <div className="h-0.5 w-16 bg-stone-900 mx-auto mt-3" />
          </div>

          {/* Broadsheet Video Frame */}
          <div className="rounded-xl border-2 border-stone-950 bg-[#F6F4EE] p-3 sm:p-5 shadow-lg">
            {/* Editorial Top Rule Bar */}
            <div className="mb-3 flex items-center justify-between border-b border-stone-300 pb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-800" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-950">
                  TrustGate Official Demonstration
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone-600">
                80s · CIS-8004 · x402 · Art. 12
              </span>
            </div>

            {/* Responsive 16:9 Video Player */}
            <div className="relative w-full overflow-hidden rounded-lg border border-stone-400 bg-stone-950 aspect-video shadow-inner">
              <iframe
                src="https://www.youtube.com/embed/u_wb-OnNzN8?rel=0&modestbranding=1"
                title="TrustGate Product Demonstration Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            {/* Editorial Caption Underneath */}
            <div className="mt-3.5 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-serif text-stone-700 gap-2">
              <p className="italic">
                &ldquo;Where autonomous scripts meet cryptographic human ownership, instant micro-monetization, and EU AI Act compliance.&rdquo;
              </p>
              <span className="font-mono text-[11px] font-semibold text-stone-900 shrink-0">
                English Narration (Daniel) + Subtitles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Broadsheet Pipeline Section */}
      <section id="pipeline" className="border-t-2 border-stone-900 bg-[#ECE8DD] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-stone-600 font-bold">
              [ PROTOCOL ARCHITECTURE ]
            </span>
            <h2 className="font-serif text-3xl font-black text-stone-950 uppercase tracking-tight mt-1">
              The Three Core Checks
            </h2>
            <div className="h-0.5 w-16 bg-stone-900 mx-auto mt-2" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-stone-400 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-mono font-bold text-stone-500 text-xs">CHECK 01</span>
                <span className="font-serif italic text-xs text-stone-600">Identity Layer</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-950">Who Are You?</h3>
              <p className="font-serif text-xs text-stone-700 leading-relaxed">
                The gateway intercepts the incoming call and validates the <code>X-Concordium-Badge</code> token. It confirms that the agent is registered in CIS-8004 and binds to the caller's Base EVM key via CIS-8.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono font-semibold text-stone-900">
                Rule: Missing badge → 403 Forbidden
              </div>
            </div>

            <div className="rounded-xl border border-stone-400 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-mono font-bold text-stone-500 text-xs">CHECK 02</span>
                <span className="font-serif italic text-xs text-stone-600">Monetization Layer</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-950">Can You Pay?</h3>
              <p className="font-serif text-xs text-stone-700 leading-relaxed">
                TrustGate issues an automated HTTP 402 Payment Required challenge. The agent settles the micro-fee in CCD automatically over x402 without credit cards or human invoices.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono font-semibold text-stone-900">
                Rule: Settle 0.002 CCD → Pass gate
              </div>
            </div>

            <div className="rounded-xl border border-stone-400 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-mono font-bold text-stone-500 text-xs">CHECK 03</span>
                <span className="font-serif italic text-xs text-stone-600">Compliance Layer</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-950">What Happened?</h3>
              <p className="font-serif text-xs text-stone-700 leading-relaxed">
                The transaction hash, caller identity, and verified Concordium owner are committed to an immutable audit record fulfilling European Union AI Act Article 12 record-keeping.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono font-semibold text-stone-900">
                Rule: Forensic audit log committed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broadsheet Standards Grid */}
      <section id="standards" className="mx-auto max-w-6xl px-6 py-14">
        <div className="border-t-2 border-b-2 border-stone-900 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-serif text-2xl font-black text-stone-950 uppercase tracking-tight">
                Concordium Component Integration
              </h3>
              <p className="font-serif text-xs text-stone-600 mt-1">
                The specific standards powering TrustGate's hackathon implementation.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-serif">
              <div className="border-l border-stone-300 pl-3">
                <span className="font-mono font-bold text-[10px] uppercase text-stone-500 block">Standard 01</span>
                <strong className="text-stone-950 block mt-0.5">CIS-8004</strong>
                <span className="text-stone-600 text-[11px]">Agent Registry</span>
              </div>

              <div className="border-l border-stone-300 pl-3">
                <span className="font-mono font-bold text-[10px] uppercase text-stone-500 block">Standard 02</span>
                <strong className="text-stone-950 block mt-0.5">CIS-8</strong>
                <span className="text-stone-600 text-[11px]">External Key Binding</span>
              </div>

              <div className="border-l border-stone-300 pl-3">
                <span className="font-mono font-bold text-[10px] uppercase text-stone-500 block">Protocol 03</span>
                <strong className="text-stone-950 block mt-0.5">x402</strong>
                <span className="text-stone-600 text-[11px]">HTTP 402 Payments</span>
              </div>

              <div className="border-l border-stone-300 pl-3">
                <span className="font-mono font-bold text-[10px] uppercase text-stone-500 block">Compliance 04</span>
                <strong className="text-stone-950 block mt-0.5">EU AI Act</strong>
                <span className="text-stone-600 text-[11px]">Article 12 Records</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broadsheet Footer */}
      <footer className="border-t-2 border-stone-900 bg-[#EFECE3] py-10 font-serif text-xs text-stone-700">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-stone-950 uppercase tracking-wider">TrustGate · Broadsheet Edition</p>
            <p className="text-[11px] text-stone-500">Concordium Trusted Agents Hackathon 2026·</p>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <a
              href={`https://ccdexplorer.io/testnet/account/${realConcordiumAccount}`}
              target="_blank"
              rel="noreferrer"
              className="text-stone-900 underline hover:text-stone-600"
            >
              CCDExplorer Registry
            </a>
            <Link href="/dashboard" className="text-stone-900 underline hover:text-stone-600">
              Launch Control Plane
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
