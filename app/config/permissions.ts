import { UserRole } from '~/types/user'

/**
 * What can be done, as `resource:action` — the convention OAuth scopes, GitHub
 * tokens and most RBAC systems use, and for the same reason: it names a
 * capability instead of a place in the UI. A permission like `invoices:delete`
 * still means the same thing after the page that used it is renamed, moved or
 * removed.
 *
 * Add one when something in the app needs it, not before. Every entry here has
 * a caller; a permission nobody asks for protects nothing. The template ships
 * with exactly one because it ships with exactly one page.
 */
export type Permission = 'dashboard:read'

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MEMBER]: 'Member',
}

/**
 * What each role may do. This is the whole authorization model, and the one
 * thing both halves of the app share: a permission means the same for a page
 * and for an endpoint, so defining it twice would be two definitions to keep
 * in sync.
 *
 * Read it as a grant list, and grant explicitly: a role holds exactly what is
 * written here. Deny by default then falls out of the data instead of being a
 * check someone can forget — a role the backend invents tomorrow arrives with
 * an empty grant list and can do nothing until you decide otherwise.
 *
 * Both roles currently hold the same single grant. They diverge as soon as you
 * add a permission only one of them gets — that is the whole mechanism.
 */
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['dashboard:read'],
  [UserRole.MEMBER]: ['dashboard:read'],
} as const satisfies Record<UserRole, readonly Permission[]>

/**
 * Reachable without a session. Matched by prefix, so '/login' also covers
 * '/login/callback'. Everything else requires one — that part stays central,
 * because a route that forgets to authenticate must not be a route that opens.
 *
 * `/api/auth` and `/auth/google` are here for the same reason `/login` is: they
 * are how a visitor *gets* a session, so requiring one would close the door
 * from the inside.
 */
export const AUTH_PUBLIC_ROUTE_PREFIXES = [
  '/login',
  '/logout',
  '/authorize',
  '/auth/google',
  '/api/auth',
] as const

/**
 * Which permission each **page** needs. Pages are a tree the user navigates, so
 * they are declared as a tree and enforced once, in the global route middleware,
 * before any page renders: every page needs an entry and one that is missing is
 * denied, so a new page fails loudly on the first click instead of shipping open.
 *
 * This is the page axis and only the page axis. Endpoints under `/api/` are
 * deliberately absent — not because a table could not hold them (the value
 * could be keyed by method), but because page access and API access are things
 * you want to move independently: showing someone a screen and letting them
 * call the endpoint behind it are separate decisions. Endpoints ask for their
 * own permission, per method, in the handler.
 */
export const AUTH_ROUTE_PERMISSIONS = {
  '/': 'dashboard:read',
} as const satisfies Record<string, Permission>
