export const usd = (n: number, max = 2) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n >= 1000 ? 0 : max,
    maximumFractionDigits: max,
  })

export const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export const compact = (n: number) =>
  n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(' ')
