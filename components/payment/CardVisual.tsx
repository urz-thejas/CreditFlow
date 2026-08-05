'use client'

import { cn } from '@/lib/utils'

interface CardVisualProps {
  cardNumber: string
  expiry: string
  cardholderName: string
  cardBrand: string
}

export function CardVisual({ cardNumber, expiry, cardholderName, cardBrand }: CardVisualProps) {
  const displayNumber = cardNumber || '•••• •••• •••• ••••'
  const displayExpiry = expiry || 'MM/YY'
  const displayName = cardholderName || 'YOUR NAME'

  return (
    <div className="relative w-full max-w-[340px] h-[200px] rounded-xl overflow-hidden mx-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D2E] via-[#252840] to-[#353860]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
        {/* Top: Chip + Brand */}
        <div className="flex items-start justify-between">
          {/* Chip */}
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="35" height="27" rx="4" fill="#D4A843" stroke="#B8922E" />
            <line x1="0" y1="14" x2="36" y2="14" stroke="#B8922E" strokeWidth="0.5" />
            <line x1="12" y1="0" x2="12" y2="28" stroke="#B8922E" strokeWidth="0.5" />
            <line x1="24" y1="0" x2="24" y2="28" stroke="#B8922E" strokeWidth="0.5" />
          </svg>
          <span className="text-[14px] font-bold text-white/80 tracking-wider">
            {cardBrand || 'VISA'}
          </span>
        </div>

        {/* Card Number */}
        <p className="font-mono text-[18px] text-white tracking-[3px]">
          {displayNumber}
        </p>

        {/* Bottom: Name + Expiry */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">
              Card Holder
            </p>
            <p className="text-[12px] text-white font-medium tracking-wider uppercase">
              {displayName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">
              Expires
            </p>
            <p className="text-[12px] text-white font-mono">
              {displayExpiry}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
