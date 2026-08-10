import { describe, expect, it } from 'vitest'
import { ROLE_PERMISSIONS } from '~/config/permissions'
import { hasPermission } from '~/core/permissions'
import { UserRole } from '~/types/user'
import { toSession, toUser } from './auth-api'

// The seam between the backend's shape and the app's. These assertions are what
// tells you the contract still holds after someone points this at another API —
// and the role case is the one whose failure is a security incident.

const WIRE_USER = {
  id: 42,
  email: 'ada@example.com',
  name: 'Ada Lovelace',
  role: 'admin',
  avatar: 'https://cdn.test/ada.png',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-02-01T00:00:00.000Z',
}

describe('toUser', () => {
  it("maps the wire shape onto the app's User", () => {
    expect(toUser(WIRE_USER)).toEqual({
      id: '42',
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      role: UserRole.ADMIN,
      avatar: 'https://cdn.test/ada.png',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-02-01T00:00:00.000Z',
    })
  })

  it('coerces a numeric id to a string', () => {
    // Backends that key on an integer are common; the app treats ids as opaque
    // strings so route params and comparisons never depend on the difference.
    expect(toUser({ ...WIRE_USER, id: 7 }).id).toBe('7')
    expect(toUser({ ...WIRE_USER, id: '7' }).id).toBe('7')
  })

  it('normalizes absent name and avatar to null', () => {
    const user = toUser({ ...WIRE_USER, name: undefined, avatar: undefined })

    expect(user.name).toBeNull()
    expect(user.avatar).toBeNull()
  })

  it('keeps a role the app has never heard of, so the guard can refuse it', () => {
    // The mapping must not coerce an unknown role to a default: that would
    // silently grant whatever the default holds. Passing it through verbatim is
    // what makes deny-by-default work — ROLE_PERMISSIONS has no entry for it.
    const user = toUser({ ...WIRE_USER, role: 'superuser' })

    expect(user.role).toBe('superuser')
    expect(hasPermission(ROLE_PERMISSIONS, user.role, 'dashboard:read')).toBe(false)
  })
})

describe('toSession', () => {
  it('keeps the token pair and nothing else', () => {
    // Whatever else the backend sends alongside the tokens stays out of the
    // cookies — and out of the payload the browser receives.
    const session = toSession({
      access_token: 'access-abc',
      refresh_token: 'refresh-xyz',
      expires_at: 1735689600,
    })

    expect(session).toEqual({ accessToken: 'access-abc', refreshToken: 'refresh-xyz' })
  })
})
