// Seeding database script
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const merchants = [
  'Campus Bookstore', 'Hostel Mess Fee', 'Semester Exam Fee',
  'Library Fine', 'Sports Complex', 'Broadband Renewal',
  'Gym Membership', 'Lab Equipment', 'Project Materials',
  'Canteen', 'Stationery Shop', 'Laundry Service',
]

const cardBrands = ['VISA', 'MASTERCARD', 'AMEX', 'RUPAY'] as const
const cardNumbers: Record<string, string> = {
  VISA: 'Visa •••• 4242',
  MASTERCARD: 'Mastercard •••• 5678',
  AMEX: 'Amex •••• 1234',
  RUPAY: 'RuPay •••• 9012',
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function randomDate(monthsBack: number): Date {
  const now = new Date()
  const past = new Date(now)
  past.setMonth(past.getMonth() - monthsBack)
  const diff = now.getTime() - past.getTime()
  return new Date(past.getTime() + Math.random() * diff)
}

function generateTxnId(date: Date, seq: number): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `TXN${y}${m}${d}${String(seq).padStart(5, '0')}`
}

async function main() {
  console.log('🌱 Seeding CreditFlow database...')

  // Clean existing data
  await prisma.transactionEvent.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.session.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.userSettings.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@1234', 10)
  const user = await prisma.user.create({
    data: {
      name: 'Arjun Rao',
      email: 'arjun@creditflow.dev',
      password: hashedPassword,
      university: 'IIT Delhi',
      studentId: 'CS2024001',
      role: 'USER',
      avatarInitials: 'AR',
    },
  })

  console.log(`✅ Created user: ${user.email}`)

  // Create user settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      emailOnSuccess: true,
      emailOnFailure: true,
      browserNotifications: false,
      theme: 'LIGHT',
    },
  })

  // Create 48 transactions
  const transactions = []
  for (let i = 0; i < 48; i++) {
    const date = randomDate(6)
    const brand = cardBrands[Math.floor(Math.random() * cardBrands.length)]
    let status: string
    if (i < 40) {
      status = 'SUCCESS'
    } else if (i < 45) {
      status = 'FAILED'
    } else {
      status = 'PENDING'
    }

    const amount = randomAmount(50, 25000)
    const completedAt = status === 'SUCCESS' ? new Date(date.getTime() + 3000) : (status === 'FAILED' ? new Date(date.getTime() + 2500) : null)

    const txn = await prisma.transaction.create({
      data: {
        txnId: generateTxnId(date, i + 1),
        userId: user.id,
        amount,
        description: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        cardNumber: cardNumbers[brand],
        cardBrand: brand,
        processingFee: 0,
        failureReason: status === 'FAILED' ? 'Card declined by issuing bank' : null,
        referenceCode: status === 'FAILED' ? `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}` : null,
        initiatedAt: date,
        completedAt,
        createdAt: date,
      },
    })

    transactions.push(txn)

    // Create timeline events for each transaction
    const baseEvents = [
      {
        step: 'Initiated',
        status: 'COMPLETED',
        description: 'Payment request received',
        timestamp: date,
      },
      {
        step: 'Processing',
        status: 'COMPLETED',
        description: 'Processing with payment gateway',
        timestamp: new Date(date.getTime() + 1000),
      },
      {
        step: 'Verifying',
        status: status === 'PENDING' ? 'PENDING' : 'COMPLETED',
        description: 'Verifying card details with issuing bank',
        timestamp: new Date(date.getTime() + 2000),
      },
    ]

    if (status === 'SUCCESS') {
      baseEvents.push({
        step: 'Completed',
        status: 'COMPLETED',
        description: 'Payment completed successfully',
        timestamp: new Date(date.getTime() + 3000),
      })
    } else if (status === 'FAILED') {
      baseEvents.push({
        step: 'Failed',
        status: 'FAILED',
        description: 'Card declined by issuing bank',
        timestamp: new Date(date.getTime() + 2500),
      })
    }

    for (const event of baseEvents) {
      await prisma.transactionEvent.create({
        data: {
          transactionId: txn.id,
          ...event,
        },
      })
    }
  }

  console.log(`✅ Created ${transactions.length} transactions with timeline events`)

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        body: 'Your payment of ₹5,200.00 to Campus Bookstore was successful.',
        read: false,
      },
      {
        userId: user.id,
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed',
        body: 'Your payment of ₹3,500.00 to Lab Equipment was declined.',
        read: false,
      },
      {
        userId: user.id,
        type: 'INFO',
        title: 'Welcome to CreditFlow!',
        body: 'Your account has been set up. Start making payments today.',
        read: true,
      },
    ],
  })

  console.log('✅ Created 3 notifications')
  console.log('🎉 Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
