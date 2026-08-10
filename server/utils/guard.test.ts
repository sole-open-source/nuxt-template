import type { Permission } from '~/config/permissions'
import type { User } from '~/types/user'
import { isError } from 'h3'
import { describe, expect, it } from 'vitest'
import { UserRole } from '~/types/user'
import { createPermissionGuard } from './guard'

// The guard is the enforcement point for endpoints: every handler calls it, so
// what it lets through is what the API lets through.

function userWith(role: string): User {
  return {
    id: '1',
    name: 'Test',
    email: 'test@example.com',
    role: role as UserRole,
    avatar: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
}

/** Returns the HTTP status the guard threw, or null if it let the call pass. */
function statusFor(user: User | null, permission: Permission): number | null {
  try {
    createPermissionGuard(() => user)(permission)
    return null
  } catch (err) {
    if (isError(err)) return err.statusCode
    throw err
  }
}

describe('createPermissionGuard', () => {
  it('lets a role holding the permission through', () => {
    // There is no "unrestricted" permission: these roles reach the dashboard
    // because the grant is written down, not by falling through.
    expect(statusFor(userWith(UserRole.ADMIN), 'dashboard:read')).toBeNull()
    expect(statusFor(userWith(UserRole.MEMBER), 'dashboard:read')).toBeNull()
  })

  it('denies a signed-in role that does not hold it with 403', () => {
    // A restrictive role added to the backend must not widen access here: it
    // arrives with an empty grant list and is refused without a special case.
    expect(statusFor(userWith('viewer'), 'dashboard:read')).toBe(403)
  })

  it('answers 401, not 403, without a session', () => {
    // The caller can tell "sign in again" from "this is not for you".
    expect(statusFor(null, 'dashboard:read')).toBe(401)
  })
})
