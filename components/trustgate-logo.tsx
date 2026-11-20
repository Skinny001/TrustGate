import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full';
  monochrome?: boolean;
}

export function TrustGateLogo({
  className = '',
  size = 40,
  variant = 'emblem',
  monochrome = false,
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Bespoke Broadsheet Engraved Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        {/* Outer Circular Broadsheet Stamp Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#1C1917"
          strokeWidth="2.5"
          className="stroke-stone-900"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="#1C1917"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          className="stroke-stone-700"
        />

        {/* Outer Shield Boundary */}
        <path
          d="M50 16L76 25V46C76 63 65 77 50 83C35 77 24 63 24 46V25L50 16Z"
          fill="#1C1917"
          className="fill-stone-900"
        />

        {/* Inner Classical Architectural Archway (The Gate) */}
        <path
          d="M50 22L70 29.5V46C70 59 61.5 71 50 76.5C38.5 71 30 59 30 46V29.5L50 22Z"
          fill="#F6F4EE"
          className="fill-[#F6F4EE]"
        />

        {/* The Gateway Pillars & Roman Arch */}
        <path
          d="M38 43C38 36.37 43.37 31 50 31C56.63 31 62 36.37 62 43V68H56V44C56 40.69 53.31 38 50 38C46.69 38 44 40.69 44 44V68H38V43Z"
          fill="#1C1917"
          className="fill-stone-900"
        />

        {/* Central Lintel / Transom Bar */}
        <rect x="36" y="47" width="28" height="3" fill="#1C1917" className="fill-stone-900" />

        {/* Central Cryptographic Keyhole (Concordium Identity Checkpoint) */}
        <circle cx="50" cy="57" r="3.5" fill="#1C1917" className="fill-stone-900" />
        <polygon points="48.5,58.5 51.5,58.5 52.5,65 47.5,65" fill="#1C1917" className="fill-stone-900" />

        {/* Keystone Crown */}
        <polygon points="47,20 53,20 54,26 46,26" fill="#1C1917" className="fill-stone-900" />
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-xl font-black uppercase tracking-tight text-stone-950 leading-none">
            TrustGate
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-600 mt-1">
            Concordium Gateway
          </span>
        </div>
      )}
    </div>
  );
}
