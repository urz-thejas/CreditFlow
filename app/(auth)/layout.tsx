'use client'

import { SessionProvider } from 'next-auth/react'
import { Zap } from 'lucide-react'

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] bg-sidebar flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CreditFlow</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Pay Smarter.
            <br />
            Study Harder.
          </h2>
          <p className="text-text-sidebar text-[15px] leading-relaxed max-w-sm">
            CreditFlow helps college students manage every campus payment — fast, secure, tracked.
          </p>
          <div className="flex gap-4 pt-2">
            {[
              { label: '10K+', desc: 'Students' },
              { label: '₹50L+', desc: 'Processed' },
              { label: '99.9%', desc: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.label}</p>
                <p className="text-[12px] text-text-sidebar mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-text-sidebar/60">
          CreditFlow © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </SessionProvider>
  )
}
