import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { paymentSchema } from '@/lib/validators'
import { simulatePayment, generateTxnId, sleep } from '@/lib/sandbox'
import { detectCardBrand, maskCard } from '@/lib/formatters'
import { isDynamicServerError } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = paymentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { amount, description, cardNumber, cardholderName } = parsed.data

    // Simulate processing delay
    await sleep(2500)

    // Determine outcome
    const outcome = simulatePayment(cardNumber)
    const status = outcome === 'success' ? 'SUCCESS' : 'FAILED'
    const brand = detectCardBrand(cardNumber)
    const maskedCard = maskCard(cardNumber, brand)
    const txnId = generateTxnId()
    const now = new Date()

    // Create transaction with timeline events
    const transaction = await prisma.transaction.create({
      data: {
        txnId,
        userId: session.user.id,
        amount,
        description: description || `Payment by ${cardholderName}`,
        status,
        cardNumber: maskedCard,
        cardBrand: brand,
        processingFee: 0,
        failureReason: status === 'FAILED' ? 'Card declined by issuing bank' : null,
        referenceCode:
          status === 'FAILED'
            ? `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            : null,
        initiatedAt: now,
        completedAt: status === 'SUCCESS' ? new Date(now.getTime() + 2500) : null,
        timeline: {
          create: [
            {
              step: 'Initiated',
              status: 'COMPLETED',
              description: 'Payment request received',
              timestamp: now,
            },
            {
              step: 'Processing',
              status: 'COMPLETED',
              description: 'Processing with payment gateway',
              timestamp: new Date(now.getTime() + 800),
            },
            {
              step: 'Verifying',
              status: 'COMPLETED',
              description: 'Verifying card details with issuing bank',
              timestamp: new Date(now.getTime() + 1600),
            },
            {
              step: status === 'SUCCESS' ? 'Completed' : 'Failed',
              status: status === 'SUCCESS' ? 'COMPLETED' : 'FAILED',
              description:
                status === 'SUCCESS'
                  ? 'Payment completed successfully'
                  : 'Card declined by issuing bank',
              timestamp: new Date(now.getTime() + 2500),
            },
          ],
        },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: status === 'SUCCESS' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
        title: status === 'SUCCESS' ? 'Payment Successful' : 'Payment Failed',
        body:
          status === 'SUCCESS'
            ? `Your payment of ₹${amount.toLocaleString('en-IN')} was successful.`
            : `Your payment of ₹${amount.toLocaleString('en-IN')} was declined.`,
      },
    })

    return NextResponse.json({
      txnId: transaction.txnId,
      transactionId: transaction.id,
      status,
      amount,
      redirectTo:
        status === 'SUCCESS' ? '/payment/success' : '/payment/failure',
    })
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

