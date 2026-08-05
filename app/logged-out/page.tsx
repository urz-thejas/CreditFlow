import { Metadata } from 'next'
import Link from 'next/link'
import { LogOut, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Signed Out — CreditFlow',
}

export default function LoggedOutPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-light/30 flex items-center justify-center">
            <LogOut className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-text-primary">You&apos;ve been signed out</h1>
          <p className="text-[14px] text-text-secondary mt-2">
            Thank you for using CreditFlow. Have a great day!
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Sign In Again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full" size="lg" leftIcon={<Home className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
