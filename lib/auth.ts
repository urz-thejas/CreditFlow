import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/lib/validators'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // On sign-in, persist id and name to JWT
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      // On explicit session update (e.g. after profile save)
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        if (token.name) {
          session.user.name = token.name as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logged-out',
    error: '/login',
  },
  trustHost: true,
})
