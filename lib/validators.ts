import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const paymentSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(1, 'Minimum amount is ₹1')
    .max(1000000, 'Maximum amount is ₹10,00,000'),
  description: z.string().optional(),
  cardNumber: z
    .string()
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number cannot exceed 19 digits')
    .refine((val) => /^\d[\d\s]*\d$|^\d$/.test(val.trim()), 'Card number must contain only digits'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format')
    .refine((val) => {
      const [month, year] = val.split('/')
      const now = new Date()
      const expiry = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, 1)
      // Card is valid through the end of the expiry month
      const expiryEnd = new Date(expiry.getFullYear(), expiry.getMonth() + 1, 0)
      return expiryEnd >= now
    }, 'Card has expired'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3–4 digits'),
  cardholderName: z
    .string()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(60, 'Cardholder name is too long')
    .refine((val) => /^[a-zA-Z\s'-]+$/.test(val.trim()), 'Name can only contain letters, spaces, hyphens, and apostrophes'),
})

// Profile: matches the profile page form fields and API handler
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  university: z.string().optional().or(z.literal('')),
  studentId: z.string().optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Settings: field names match Prisma UserSettings model
export const settingsSchema = z.object({
  emailOnSuccess: z.boolean().optional(),
  emailOnFailure: z.boolean().optional(),
  browserNotifications: z.boolean().optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
