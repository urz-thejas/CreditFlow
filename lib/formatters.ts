export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Number(amount))

export const maskCard = (cardNumber: string, brand: string): string => {
  const last4 = cardNumber.replace(/\s/g, '').slice(-4)
  return `${brand} •••• ${last4}`
}

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

export const formatDateTime = (date: Date | string): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export const formatTime = (date: Date | string): string =>
  new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))

export const getGreeting = (): string => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}

export const detectCardBrand = (number: string): string => {
  const cleaned = number.replace(/\s/g, '')
  if (/^4/.test(cleaned)) return 'VISA'
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'MASTERCARD'
  if (/^3[47]/.test(cleaned)) return 'AMEX'
  if (/^(508|606|607|608|81[0-9]|82[0-9]|353|356)/.test(cleaned)) return 'RUPAY'
  return 'UNKNOWN'
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
