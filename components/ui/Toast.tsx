'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          'bg-surface border border-border text-text-primary shadow-md rounded-lg',
        style: {
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        },
      }}
      richColors
      closeButton
    />
  )
}
