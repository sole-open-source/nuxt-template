/**
 * The page-access decision, in one pure function.
 *
 * Nuxt renders a page twice over its life: on the server for the first request,
 * and in the browser for every navigation after that. Only the first reaches
 * Nitro, so a page guard that lived only in server middleware would stop
 * enforcing the moment the router took over. Both callers — the global route
 * middleware, which runs in both places — ask this function, so there is one
 * table and one answer, and the callers differ only in how they deliver the
 * refusal.
 *
 * The server is still the boundary that matters: `server/middleware/auth.ts`
 * resolves the session against the backend on every request that reaches it,
 * and every endpoint asks `event.context.requirePermission` for itself. What
 * this function adds is that the browser never renders a page the server would
 * have refused.
 */
import type { User } from '~/types/user'
import { AUTH_DEFAULT_REDIRECT_PATH, AUTH_LOGIN_PATH } from '~/config/app'
import {
  AUTH_PUBLIC_ROUTE_PREFIXES,
  AUTH_ROUTE_PERMISSIONS,
  ROLE_PERMISSIONS,
} from '~/config/permissions'
import { hasPermission, isPrefixOf, permissionForRoute } from '~/core/permissions'
import { encodeRedirect } from '~/features/auth/redirect'

/**
 * `undeclared` is not a user problem — the page exists but nobody put it in
 * `AUTH_ROUTE_PERMISSIONS`. It is separated from `forbidden` so the server can
 * say so in the log while the visitor still gets an ordinary 403.
 */
export type PageAccess = 'public' | 'allowed' | 'unauthenticated' | 'undeclared' | 'forbidden'

export function isPublicRoute(pathname: string): boolean {
  return AUTH_PUBLIC_ROUTE_PREFIXES.some((prefix) => isPrefixOf(prefix, pathname))
}

export function pageAccess(user: User | null | undefined, pathname: string): PageAccess {
  if (isPublicRoute(pathname)) return 'public'
  if (!user) return 'unauthenticated'

  const required = permissionForRoute(AUTH_ROUTE_PERMISSIONS, pathname)
  if (!required) return 'undeclared'

  return hasPermission(ROLE_PERMISSIONS, user.role, required) ? 'allowed' : 'forbidden'
}

/** The login URL that remembers where the visitor was heading. */
export function loginUrl(pathname: string, search = ''): string {
  // Landing on the default route carries nothing worth coming back to.
  if (pathname === AUTH_DEFAULT_REDIRECT_PATH && !search) return AUTH_LOGIN_PATH

  // Escaped because base64 uses '+' and '=', which are not query-string safe.
  const target = encodeURIComponent(encodeRedirect(pathname + search))
  return `${AUTH_LOGIN_PATH}?redirect=${target}`
}
