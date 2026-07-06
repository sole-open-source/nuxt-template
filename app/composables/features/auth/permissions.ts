import {
  AUTH_ROUTE_PERMISSIONS,
  DEFAULT_ROUTE,
  PERMISSION_GROUPS,
  PUBLIC_ROUTES,
} from '~/config/domain'
import type { PermissionGroup } from '~/config/domain'
import { UserRole } from '~/types/auth/roles'
import type { User } from '~/types'

export function hasPermission(user: User, group: PermissionGroup): boolean {
  if (user.roles.includes(UserRole.ADMIN)) return true
  return PERMISSION_GROUPS[group].some((role) => user.roles.includes(role))
}

export function hasAnyPermission(user: User, groups: readonly PermissionGroup[]): boolean {
  return groups.some((group) => hasPermission(user, group))
}

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))
}

/** Roles permitidos para `path`, o `null` si la ruta no tiene restricción de rol. */
function rolesRequiredFor(path: string): readonly UserRole[] | null {
  const rule = AUTH_ROUTE_PERMISSIONS.find(
    ({ prefix }) => path === prefix || path.startsWith(`${prefix}/`),
  )
  return rule?.roles ?? null
}

export function canAccessRoute(path: string, user: User): boolean {
  const requiredRoles = rolesRequiredFor(path)
  if (!requiredRoles) return true
  return user.roles.some((role) => requiredRoles.includes(role))
}

export function resolveDefaultRoute(_user: User): string {
  return DEFAULT_ROUTE
}
