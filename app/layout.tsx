import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CreditFlow — College Payment Management',
  description: 'The all-in-one financial dashboard for college students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('creditflow-ui');
                if (stored) {
                  var parsed = JSON.parse(stored);
                  var theme = parsed && parsed.state && parsed.state.theme;
                  if (theme === 'system' || !theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-bg text-text-primary antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
