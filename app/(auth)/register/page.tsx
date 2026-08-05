import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — CreditFlow',
  description: 'Create your CreditFlow account to start managing campus payments.',
}

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Get started with CreditFlow in seconds
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
