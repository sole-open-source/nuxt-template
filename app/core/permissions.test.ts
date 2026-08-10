import type { Permission } from '~/config/permissions'
import { describe, expect, it } from 'vitest'
import { NAVIGATION_ITEMS } from '~/config/navigation'
import { AUTH_ROUTE_PERMISSIONS, ROLE_PERMISSIONS } from '~/config/permissions'
import { UserRole } from '~/types/user'
import { hasPermission, permissionForRoute } from './permissions'

// This is the access control of the app: the role × permission matrix is
// asserted in full, and the unknown role and the undeclared page are the cases
// that must fail shut. Enforcement itself is server/utils/guard.test.ts and
// server/middleware/auth.test.ts.

describe('hasPermission', () => {
  const matrix: Array<[UserRole, Permission, boolean]> = [
    [UserRole.ADMIN, 'dashboard:read', true],
    [UserRole.MEMBER, 'dashboard:read', true],
  ]

  it.each(matrix)('%s %s the permission %s', (role, permission, expected) => {
    expect(hasPermission(ROLE_PERMISSIONS, role, permission)).toBe(expected)
  })

  it('grants nothing to a role the frontend has never heard of', () => {
    // A role added to the backend arrives with no grants, so a restrictive new
    // role cannot widen access here by falling back to a known one.
    expect(hasPermission(ROLE_PERMISSIONS, 'viewer', 'dashboard:read')).toBe(false)
  })

  it('grants nothing without a role', () => {
    expect(hasPermission(ROLE_PERMISSIONS, null, 'dashboard:read')).toBe(false)
    expect(hasPermission(ROLE_PERMISSIONS, undefined, 'dashboard:read')).toBe(false)
  })
})

describe("permissionForRoute (the app's own table)", () => {
  it('resolves each declared page to its permission', () => {
    expect(permissionForRoute(AUTH_ROUTE_PERMISSIONS, '/')).toBe('dashboard:read')
  })

  it('returns null for a page that is not declared', () => {
    // Null is the deny case: callers must not read it as "unrestricted".
    expect(permissionForRoute(AUTH_ROUTE_PERMISSIONS, '/reports')).toBeNull()
  })

  it('does not let the root entry act as a prefix for every path', () => {
    // As a plain string prefix, '/' would swallow every path and undo the
    // deny-by-default — every role holds 'dashboard:read'.
    expect(permissionForRoute(AUTH_ROUTE_PERMISSIONS, '/admin')).toBeNull()
    expect(permissionForRoute(AUTH_ROUTE_PERMISSIONS, '/anything/nested')).toBeNull()
  })
})

describe('permissionForRoute (prefix resolution)', () => {
  // Fixture tables: these pin the matching rules themselves, independent of
  // whatever pages this particular app happens to declare.
  const routes = { '/admin': 'users:read', '/admin/danger': 'users:delete' } as const

  it('applies a declared page to everything nested under it', () => {
    expect(permissionForRoute(routes, '/admin/settings')).toBe('users:read')
  })

  it('resolves with the longest matching prefix, not the first one', () => {
    expect(permissionForRoute(routes, '/admin/danger')).toBe('users:delete')
    expect(permissionForRoute(routes, '/admin/danger/nested')).toBe('users:delete')
    expect(permissionForRoute(routes, '/admin/other')).toBe('users:read')
  })

  it('does not match a sibling that merely shares a prefix string', () => {
    expect(permissionForRoute(routes, '/admin-panel')).toBeNull()
  })
})

describe('the sidebar never offers a link the guard would refuse', () => {
  // Nav visibility and route access are declared separately on purpose — you
  // may want a screen reachable but unlisted. The reverse is always a bug: a
  // menu entry that 403s on click. This is the only direction worth pinning.
  it.each(Object.values(UserRole))('holds for %s', (role) => {
    for (const item of NAVIGATION_ITEMS) {
      if (!hasPermission(ROLE_PERMISSIONS, role, item.requiredPermission)) continue

      const required = permissionForRoute(AUTH_ROUTE_PERMISSIONS, item.to)
      expect(required, `${item.to} is in the menu but not in AUTH_ROUTE_PERMISSIONS`).not.toBeNull()
      expect(
        hasPermission(ROLE_PERMISSIONS, role, required!),
        `${role} sees "${item.title}" but would be refused at ${item.to}`,
      ).toBe(true)
    }
  })
})
