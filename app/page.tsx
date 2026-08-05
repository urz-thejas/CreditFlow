import Link from 'next/link'
import { ArrowRight, Zap, ShieldCheck, LineChart, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg selection:bg-primary-light selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">CreditFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-medium text-text-secondary hover:text-text-primary hidden sm:block">
              Sign In
            </Link>
            <Link href="/register">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[12px] font-medium text-primary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            CreditFlow Sandbox v1.0 Live
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
            Campus Payments, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8A4FFF]">
              Simplified &amp; Secured.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            The all-in-one financial dashboard for college students. Pay tuition, track expenses, and manage your campus life in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-[15px]" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start Managing Money
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-[15px]">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Why use CreditFlow?</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Everything you need to handle college finances, built with modern web technologies for a seamless experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary-light/50 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Simulated Sandbox</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Test payment flows with realistic success and failure scenarios without using real money.
              </p>
            </div>

            <div className="bg-bg p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-info-bg rounded-xl flex items-center justify-center mb-6">
                <LineChart className="h-6 w-6 text-info" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Smart Analytics</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Visualize your spending habits with interactive charts and automated trend analysis.
              </p>
            </div>

            <div className="bg-bg p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-success-bg rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Secure &amp; Private</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Built with industry standard security practices. Your data is encrypted and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center grayscale opacity-70">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-text-secondary">CreditFlow</span>
          </div>

          <p className="text-[13px] text-text-tertiary">
            © {new Date().getFullYear()} CreditFlow Capstone Project. Educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}
