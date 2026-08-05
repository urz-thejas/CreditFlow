'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentInput } from '@/lib/validators'
import { formatCardNumber, detectCardBrand } from '@/lib/formatters'
import { Input } from '@/components/ui/Input'
import { CardVisual } from '@/components/payment/CardVisual'
import { CreditCard, Info } from 'lucide-react'

interface PaymentFormProps {
  defaultAmount?: number
  onValuesChange: (values: Partial<PaymentInput>) => void
  onSubmit: (data: PaymentInput) => void
  register: ReturnType<typeof useForm<PaymentInput>>['register']
  errors: ReturnType<typeof useForm<PaymentInput>>['formState']['errors']
  watch: ReturnType<typeof useForm<PaymentInput>>['watch']
}

export function PaymentForm({ defaultAmount, onValuesChange, register, errors, watch }: PaymentFormProps) {
  const cardNumber = watch('cardNumber') || ''
  const expiry = watch('expiry') || ''
  const cardholderName = watch('cardholderName') || ''
  const brand = detectCardBrand(cardNumber)

  return (
    <div className="space-y-6">
      {/* Payment Details */}
      <div>
        <h3 className="text-[15px] font-semibold text-text-primary mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-text-secondary block mb-1.5">
              Amount <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-mono text-[16px]">₹</span>
              <input
                type="number"
                step="0.01"
                min="1"
                defaultValue={defaultAmount}
                className="w-full h-12 pl-8 pr-3 bg-surface border border-border rounded-md text-[20px] font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-[12px] text-error mt-1">{errors.amount.message}</p>
            )}
          </div>

          <Input
            label="Description"
            placeholder="e.g. Semester exam fee"
            {...register('description')}
          />
        </div>
      </div>

      {/* Test Card */}
      <div>
        <h3 className="text-[15px] font-semibold text-text-primary mb-4">Test Card</h3>

        <CardVisual
          cardNumber={formatCardNumber(cardNumber)}
          expiry={expiry}
          cardholderName={cardholderName}
          cardBrand={brand}
        />

        <div className="space-y-4 mt-5">
          <Input
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            leftIcon={<CreditCard className="h-4 w-4" />}
            error={errors.cardNumber?.message}
            required
            maxLength={19}
            {...register('cardNumber')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry"
              placeholder="MM/YY"
              error={errors.expiry?.message}
              required
              maxLength={5}
              {...register('expiry')}
            />
            <Input
              label="CVV"
              type="password"
              placeholder="•••"
              error={errors.cvv?.message}
              required
              maxLength={4}
              {...register('cvv')}
            />
          </div>

          <Input
            label="Cardholder Name"
            placeholder="ARJUN RAO"
            error={errors.cardholderName?.message}
            required
            {...register('cardholderName')}
          />

          <div className="flex items-start gap-2 p-3 bg-info-bg rounded-md">
            <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Use <code className="font-mono bg-surface px-1 py-0.5 rounded text-[11px]">4242 4242 4242 4242</code> for success ·{' '}
              <code className="font-mono bg-surface px-1 py-0.5 rounded text-[11px]">4000 0000 0000 0002</code> for failure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
