/**
 * The single exit point for logs. To ship Sentry or structured logging, write a
 * class that implements `Logger` and reassign `logger` — nothing else in the
 * codebase changes.
 */
import { normalizeError } from '~/core/errors'

export interface Logger {
  /** Logs `error` under `scope` and returns the message that is safe to show a user. */
  error(scope: string, error: unknown): string
}

class ConsoleLogger implements Logger {
  error(scope: string, error: unknown): string {
    const normalized = normalizeError(error)
    console.error(`[${scope}]`, normalized)
    return normalized.message
  }
}

let impl: Logger = new ConsoleLogger()

/**
 * A stable façade over the active implementation, so `setLogger` swaps what
 * every call site reaches without any of them re-importing anything — and
 * without exporting a mutable binding, which a module that imported it once
 * would not see change.
 */
export const logger: Logger = {
  error: (scope, error) => impl.error(scope, error),
}

/** Swaps the active implementation — e.g. for a SentryLogger, or a no-op one in tests. */
export function setLogger(next: Logger): void {
  impl = next
}
