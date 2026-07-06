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

export function isValidDate(value: string): boolean {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

export function isExpired(value: string | Date): boolean {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.getTime() < Date.now()
}

export type TimeFilter =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year'
  | 'all_time'

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  today: 'Hoy',
  yesterday: 'Ayer',
  last_7_days: 'Últimos 7 días',
  last_30_days: 'Últimos 30 días',
  last_90_days: 'Últimos 90 días',
  this_month: 'Este mes',
  last_month: 'Mes anterior',
  this_year: 'Este año',
  last_year: 'Año anterior',
  all_time: 'Todo el tiempo',
}

export function timeFilterLabel(filter: TimeFilter): string {
  return TIME_FILTER_LABELS[filter] ?? filter
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
