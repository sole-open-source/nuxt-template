/**
 * The auth middleware: one pass per request that decides whether it may continue.
 *
 * Authentication is central — a request either carries a valid session or it
 * does not, and a route that forgets to ask must not be a route that opens.
 *
 * Authorization is split on purpose, because the two halves of a full-stack app
 * are not the same shape:
 *
 * - **Pages** are a tree the user navigates, and in Nuxt they are navigated
 *   twice over: on the server for the first request, in the browser after that.
 *   So the page decision lives in `app/features/auth/access.ts` and is enforced
 *   by the global route middleware, which runs in both places. Undeclared means
 *   denied, so a new page cannot ship open by omission.
 * - **Endpoints** are not. Each handler calls `event.context.requirePermission`
 *   itself and this middleware does not second-guess it, so who may open a
 *   screen and who may call the endpoint behind it stay separate decisions —
 *   and one path can still ask for one permission on GET and another on DELETE.
 *
 * What they share is the answer to "who holds this permission"
 * (`ROLE_PERMISSIONS`) and the object that enforces it (`server/utils/guard.ts`).
 *
 * The token itself is never inspected here. The backend that issued it is the
 * authority on whether it is still valid, and asking it (`/auth/me`) is both
 * the check and the way we learn the user's current role.
 */
import type { H3Event } from 'h3'
import { normalizeError } from '~/core/errors'
import { logger } from '~/core/logger'
import { isPublicRoute, loginUrl } from '~/features/auth/access'
import { fetchMe } from '~~/server/utils/auth-api'
import { createPermissionGuard } from '~~/server/utils/guard'
import { clearAuthSession, getAuthSession } from '~~/server/utils/session'

/**
 * Endpoints get a status; page requests get sent to the login page. A `fetch()`
 * follows a 302 in silence, receives the login HTML with a 200, and fails on
 * parse — so the user sees a JSON syntax error instead of "your session
 * expired".
 */
function isEndpointRequest(pathname: string): boolean {
  return pathname.startsWith('/api/')
}

/**
 * Whether this request is worth a round trip to `/auth/me`. Build assets, Vite's
 * dev endpoints and anything in `public/` are not: they carry no session and
 * asking about one for each would put a backend call in front of every file the
 * page loads. Recognised by the two things those requests have in common — a
 * framework-reserved prefix, or a file extension, which no route here has.
 */
function isAppRequest(pathname: string): boolean {
  if (pathname.startsWith('/_') || pathname.startsWith('/@')) return false
  return !/\.[a-z0-9]+$/i.test(pathname)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { pathname, search } = getRequestURL(event)

  // With auth off there is no user to check against, so every permission passes.
  // Installed anyway: `requirePermission` is declared as always present, and a
  // route guard must not be the thing that crashes when auth is disabled.
  if (!config.public.authEnabled) {
    event.context.requirePermission = () => {}
    return
  }

  // Installed once, reading the user lazily, so there is no window in which the
  // context carries a guard bound to the wrong user and nothing to reassign
  // later. Before the session resolves it answers 401, which is correct.
  event.context.requirePermission = createPermissionGuard(() => event.context.user)

  if (!isAppRequest(pathname)) return
  if (isPublicRoute(pathname)) return

  const session = getAuthSession(event)
  if (!session) return endSession(event, pathname, search)

  try {
    event.context.user = await fetchMe(event, session.accessToken)
  } catch (err) {
    // Only a rejected token ends the session. A backend that is down or
    // erroring must not sign everyone out: that turns an outage into a
    // stampede of logins and throws away whatever the user was doing.
    const { code } = normalizeError(err)
    if (code !== 'UNAUTHORIZED' && code !== 'FORBIDDEN') {
      logger.error('auth', err)
      throw createError({
        statusCode: 503,
        statusMessage: 'Cannot verify your session right now. Please try again in a moment.',
      })
    }
    return endSession(event, pathname, search)
  }

  event.context.accessToken = session.accessToken
})

function endSession(event: H3Event, pathname: string, search: string) {
  clearAuthSession(event)

  if (isEndpointRequest(pathname)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Your session has expired. Sign in again.',
    })
  }

  return sendRedirect(event, loginUrl(pathname, search), 302)
}
