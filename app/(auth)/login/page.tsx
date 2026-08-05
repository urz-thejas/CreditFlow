import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — CreditFlow',
  description: 'Sign in to your CreditFlow account to manage campus payments.',
}

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Sign in to your CreditFlow account
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
