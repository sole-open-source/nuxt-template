import type { User } from '~/types/user'
import type { RequirePermission } from '~~/server/utils/guard'

declare module 'h3' {
  interface H3EventContext {
    /** Set by the auth middleware. Absent on public routes and when auth is disabled. */
    user?: User | null
    /** The refresh token stays in its cookie and never reaches the context or the client. */
    accessToken?: string | null
    /**
     * Throws 403 unless the current user holds the permission (401 with no
     * session). Always present: every request passes through the middleware,
     * which installs it before any route runs. Call it at the top of a handler.
     */
    requirePermission: RequirePermission
  }
}

export {}
