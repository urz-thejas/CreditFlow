'use client'

import { Loader2, ShieldCheck } from 'lucide-react'

export function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm px-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <Loader2 className="h-20 w-20 text-primary animate-spin" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Processing Payment...</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Please don&apos;t close this window
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left max-w-[240px] mx-auto">
          {['Initiating payment', 'Verifying card details', 'Completing transaction'].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ animationDelay: `${i * 500}ms` }}
                />
                <span className="text-[13px] text-text-secondary">{step}</span>
              </div>
            )
          )}
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 justify-center text-[12px] text-text-tertiary pt-4">
          <ShieldCheck className="h-4 w-4" />
          <span>256-bit encrypted</span>
        </div>
      </div>
    </div>
  )
}
