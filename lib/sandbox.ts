export function simulatePayment(cardNumber: string): 'success' | 'failure' {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (cleaned.endsWith('0002')) return 'failure'
  return 'success'
}

export function generateTxnId(): string {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const seq = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0')
  return `TXN${y}${m}${d}${seq}`
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
