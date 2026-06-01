const DEFAULT_LOCALE = 'es-CO'
const DEFAULT_CURRENCY = 'COP'

export function formatCurrency(
  value: number | string,
  opts?: { currency?: string; locale?: string; compact?: boolean },
): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  const locale = opts?.locale ?? DEFAULT_LOCALE
  const currency = opts?.currency ?? DEFAULT_CURRENCY

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: opts?.compact ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(value)
}
