import type { User } from '~/types/user'
import { describe, expect, it } from 'vitest'
import { UserRole } from '~/types/user'
import { loginUrl, pageAccess } from './access'
import { decodeRedirect } from './redirect'

// The page half of authorization. Both the route middleware and — through it —
// the server render ask this, so what it allows is what the app shows.

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

describe('pageAccess', () => {
  it('lets anyone through a public route, signed in or not', () => {
    expect(pageAccess(null, '/login')).toBe('public')
    expect(pageAccess(userWith(UserRole.MEMBER), '/logout')).toBe('public')
    expect(pageAccess(null, '/authorize')).toBe('public')
  })

  it('sends a visitor without a session to sign in', () => {
    expect(pageAccess(null, '/')).toBe('unauthenticated')
    expect(pageAccess(undefined, '/admin')).toBe('unauthenticated')
  })

  it('allows a role that holds the permission', () => {
    expect(pageAccess(userWith(UserRole.ADMIN), '/admin')).toBe('allowed')
    expect(pageAccess(userWith(UserRole.MEMBER), '/')).toBe('allowed')
  })

  it('refuses a signed-in role that lacks it', () => {
    // A member reaching /admin by typing the URL.
    expect(pageAccess(userWith(UserRole.MEMBER), '/admin')).toBe('forbidden')
  })

  it('refuses a role the frontend has never heard of', () => {
    expect(pageAccess(userWith('viewer'), '/')).toBe('forbidden')
  })

  it('refuses a page nobody declared, whatever the role', () => {
    // Deny by omission: a new page fails loudly on the first click instead of
    // shipping open.
    expect(pageAccess(userWith(UserRole.ADMIN), '/reports')).toBe('undeclared')
  })
})

describe('loginUrl', () => {
  it('carries no redirect when there is nothing worth coming back to', () => {
    expect(loginUrl('/')).toBe('/login')
  })

  it('round-trips the route the visitor was headed to', () => {
    const url = new URL(loginUrl('/admin/users', '?page=2'), 'http://localhost')

    expect(url.pathname).toBe('/login')
    expect(decodeRedirect(url.searchParams.get('redirect'))).toBe('/admin/users?page=2')
  })
})
