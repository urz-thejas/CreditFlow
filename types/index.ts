import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}

// App-level types
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
export type CardBrand = 'VISA' | 'MASTERCARD' | 'AMEX' | 'RUPAY'
export type EventStatus = 'COMPLETED' | 'PENDING' | 'FAILED'
export type NotificationType = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'INFO' | 'WARNING'
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM'
export type Role = 'USER' | 'ADMIN'

export interface TransactionEvent {
  id: string
  transactionId: string
  step: string
  status: EventStatus
  description: string
  timestamp: string
}

export interface Transaction {
  id: string
  txnId: string
  userId: string
  amount: number
  description: string | null
  status: TransactionStatus
  cardNumber: string
  cardBrand: CardBrand
  processingFee: number
  failureReason: string | null
  referenceCode: string | null
  initiatedAt: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
  timeline?: TransactionEvent[]
}

export interface DashboardStats {
  totalPaid: number
  thisMonth: number
  totalTransactions: number
  successRate: number
  monthlyTrends: { month: string; amount: number }[]
  trendVsLastMonth: {
    totalPaid: number
    thisMonth: number
    totalTransactions: number
    successRate: number
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  bio: string | null
  avatarInitials: string | null
  createdAt: string
}

export interface UserSettings {
  emailOnSuccess: boolean
  emailOnFailure: boolean
  browserNotifications: boolean
  theme: Theme
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}
