import type { H3Event } from 'h3'
import type { User } from '~/types/user'
import { isError } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '~/core/errors'
import { UserRole } from '~/types/user'
import handler from './auth'

// The middleware is the only thing standing between an anonymous request and
// the app's data, so what it does on a missing, rejected or unverifiable
// session is asserted here rather than discovered in production.

const { fetchMe } = vi.hoisted(() => ({ fetchMe: vi.fn() }))
vi.mock('~~/server/utils/auth-api', () => ({ fetchMe }))

const { getAuthSession, clearAuthSession } = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  clearAuthSession: vi.fn(),
}))
vi.mock('~~/server/utils/session', () => ({ getAuthSession, clearAuthSession }))

// Silenced on purpose: the outage case logs, and its own behaviour is covered
// by app/core/logger.test.ts.
vi.mock('~/core/logger', () => ({ logger: { error: vi.fn(() => 'logged') } }))

const SESSION = { accessToken: 'access-abc', refreshToken: 'refresh-xyz' }

let requestUrl = new URL('http://localhost/')
vi.stubGlobal('getRequestURL', () => requestUrl)
vi.stubGlobal('sendRedirect', (_event: unknown, location: string) => ({
  kind: 'redirect',
  location,
}))

function userWith(role: string): User {
  return {
    id: '1',
    email: 'test@example.com',
    name: 'Test',
    role: role as UserRole,
    avatar: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
}

type Outcome =
  { kind: 'resolved' } | { kind: 'redirect'; location: string } | { kind: 'error'; status: number }

async function callAuth(pathname: string, session: typeof SESSION | null = null) {
  requestUrl = new URL(`http://localhost${pathname}`)
  getAuthSession.mockReturnValue(session)

  const event = { context: {} } as H3Event

  let outcome: Outcome
  try {
    outcome = ((await handler(event)) as Outcome | undefined) ?? { kind: 'resolved' }
  } catch (err) {
    if (!isError(err)) throw err
    outcome = { kind: 'error', status: err.statusCode }
  }

  return { outcome, context: event.context, cleared: clearAuthSession.mock.calls.length > 0 }
}

beforeEach(() => {
  fetchMe.mockReset()
  clearAuthSession.mockClear()
})

describe('auth middleware', () => {
  it('lets a public route through without a session', async () => {
    const { outcome } = await callAuth('/login')

    expect(outcome).toEqual({ kind: 'resolved' })
    expect(fetchMe).not.toHaveBeenCalled()
  })

  it('leaves build assets and public files alone', async () => {
    // Asking /auth/me about a stylesheet would put a backend call in front of
    // every file the page loads.
    expect((await callAuth('/_nuxt/entry.js')).outcome).toEqual({ kind: 'resolved' })
    expect((await callAuth('/favicon.ico')).outcome).toEqual({ kind: 'resolved' })
    expect(fetchMe).not.toHaveBeenCalled()
  })

  it('sends a page request without a session to the login page', async () => {
    const { outcome } = await callAuth('/')

    expect(outcome).toEqual({ kind: 'redirect', location: '/login' })
  })

  it('keeps the route it was headed to in the redirect', async () => {
    const { outcome } = await callAuth('/reports')

    expect(outcome).toMatchObject({ kind: 'redirect' })
    expect((outcome as { location: string }).location).toMatch(/^\/login\?redirect=/)
  })

  it('answers an endpoint request without a session with 401 instead of redirecting', async () => {
    // A fetch() follows a 302 in silence and then fails parsing login HTML.
    const { outcome } = await callAuth('/api/reports')

    expect(outcome).toEqual({ kind: 'error', status: 401 })
  })

  it('resolves the user and exposes the access token on a valid session', async () => {
    fetchMe.mockResolvedValue(userWith(UserRole.ADMIN))

    const { outcome, context } = await callAuth('/', SESSION)

    expect(outcome).toEqual({ kind: 'resolved' })
    expect(context.user?.role).toBe(UserRole.ADMIN)
    expect(context.accessToken).toBe(SESSION.accessToken)
  })

  it('installs a guard bound to the resolved user', async () => {
    fetchMe.mockResolvedValue(userWith(UserRole.MEMBER))
    const granted = await callAuth('/', SESSION)
    expect(() => granted.context.requirePermission('dashboard:read')).not.toThrow()

    // Same request, a role this app grants nothing to: the guard follows the
    // user it was bound to, not the route.
    fetchMe.mockResolvedValue(userWith('viewer'))
    const refused = await callAuth('/', SESSION)
    expect(() => refused.context.requirePermission('dashboard:read')).toThrow()
  })

  it('ends the session when the backend rejects the token', async () => {
    fetchMe.mockRejectedValue(new AppError('UNAUTHORIZED', 'Token expired.'))

    const { outcome, cleared } = await callAuth('/', SESSION)

    expect(outcome).toEqual({ kind: 'redirect', location: '/login' })
    expect(cleared).toBe(true)
  })

  it('fails the request but keeps the session when the backend is unreachable', async () => {
    // An outage must not sign everyone out: that turns downtime into a stampede
    // of logins and throws away whatever the user was doing.
    fetchMe.mockRejectedValue(new AppError('NETWORK', 'Connection refused.'))

    const { outcome, cleared } = await callAuth('/', SESSION)

    expect(outcome).toEqual({ kind: 'error', status: 503 })
    expect(cleared).toBe(false)
  })

  it('keeps the session when the backend answers 500', async () => {
    fetchMe.mockRejectedValue(new AppError('SERVER_ERROR', 'Boom.'))

    const { outcome, cleared } = await callAuth('/', SESSION)

    expect(outcome).toEqual({ kind: 'error', status: 503 })
    expect(cleared).toBe(false)
  })
})

describe('auth middleware on endpoints', () => {
  it('does not apply the page table to /api', async () => {
    // /api/reports is absent from AUTH_ROUTE_PERMISSIONS by design: the handler
    // authorizes itself, per method.
    fetchMe.mockResolvedValue(userWith(UserRole.ADMIN))

    const { outcome } = await callAuth('/api/reports', SESSION)

    expect(outcome).toEqual({ kind: 'resolved' })
  })

  it('leaves the decision to the handler, which gets a guard bound to the user', async () => {
    fetchMe.mockResolvedValue(userWith('viewer'))

    const { outcome, context } = await callAuth('/api/reports', SESSION)

    // The middleware passes it through...
    expect(outcome).toEqual({ kind: 'resolved' })
    // ...and the handler's own call is what refuses.
    expect(() => context.requirePermission('dashboard:read')).toThrow()
  })
})
