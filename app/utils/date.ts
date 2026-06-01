const DEFAULT_LOCALE = 'es-CO'

export function formatDate(
  value: string | Date,
  opts?: { locale?: string; format?: 'short' | 'medium' | 'long' },
): string {
  const date = typeof value === 'string' ? new Date(value) : value
  const locale = opts?.locale ?? DEFAULT_LOCALE

  const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
  }

  return new Intl.DateTimeFormat(locale, formatMap[opts?.format ?? 'medium']).format(date)
}

export function relativeTime(value: string | Date, locale = DEFAULT_LOCALE): string {
  const date = typeof value === 'string' ? new Date(value) : value
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, 'second')
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute')
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour')
  return rtf.format(diffDays, 'day')
}
