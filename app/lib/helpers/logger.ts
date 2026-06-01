type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (import.meta.dev) {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888',
      info: 'color: #4fc3f7',
      warn: 'color: #ffb74d',
      error: 'color: #ef5350; font-weight: bold',
    }
    // eslint-disable-next-line no-console
    console.log(`%c[${level.toUpperCase()}] ${message}`, styles[level], context ?? '')
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}
