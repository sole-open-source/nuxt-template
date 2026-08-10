/**
 * The authorization check, injected per request as `event.context.requirePermission`.
 *
 * Endpoints declare their own permission because they are method-scoped —
 * reading a collection and deleting from it are not the same permission, and a
 * path-keyed table cannot say so. Pages are the other half, and they are
 * declared as a tree in `AUTH_ROUTE_PERMISSIONS`.
 *
 * It throws instead of returning a boolean on purpose: an authorization check
 * whose result you can forget to act on is not a check. There is no `can()`
 * alongside it because nothing on the server needs one — the sidebar asks
 * `useAuth().can` on the client, with the user from the payload.
 */
import type { Permission } from '~/config/permissions'
import type { User } from '~/types/user'
import { createError } from 'h3'
import { ROLE_PERMISSIONS } from '~/config/permissions'
import { hasPermission } from '~/core/permissions'

export type RequirePermission = (permission: Permission) => void

/**
 * 401 without a session, 403 with one that lacks the permission — the caller
 * can tell "sign in again" from "this is not for you", and so can a fetch().
 *
 * Takes a getter rather than a user so the middleware can install it before the
 * session is resolved and never has to replace it. Deliberately does NOT
 * consult the `authEnabled` flag: that switch belongs to the middleware, which
 * decides whether to install this guard at all. Reading it here would make
 * every authorization test pass without asserting anything on a machine whose
 * .env has auth off.
 */
export function createPermissionGuard(getUser: () => User | null | undefined): RequirePermission {
  return (permission) => {
    const user = getUser()

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You need to sign in to access this resource.',
      })
    }

    if (!hasPermission(ROLE_PERMISSIONS, user.role, permission)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have access to this resource.',
      })
    }
  }
}
