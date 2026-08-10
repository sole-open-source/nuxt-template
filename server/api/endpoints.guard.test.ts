/// <reference types="vite/client" />
import type { H3Event } from 'h3'
import { isError } from 'h3'
import { describe, expect, it } from 'vitest'

/**
 * Pages and endpoints fail in opposite directions, and this test covers the
 * dangerous one.
 *
 * A page left out of AUTH_ROUTE_PERMISSIONS is denied — the route middleware has
 * a table to miss it in. An endpoint has no such table by design: it authorizes
 * itself, so a handler that forgets `event.context.requirePermission` is open to
 * any signed-in user, and nothing in lint, types or the middleware can notice.
 *
 * So the check lives here: every endpoint under `/api` must refuse a request
 * whose guard refuses. The first one you add is covered the moment you add it,
 * and an unguarded one turns this red.
 *
 * `auth/` is excluded, and it is the one exclusion allowed: those routes are how
 * a visitor gets a session in the first place, so requiring one would close the
 * door from the inside. They are listed in AUTH_PUBLIC_ROUTE_PREFIXES for the
 * same reason.
 */

const modules = import.meta.glob('./**/*.ts', { eager: true }) as Record<
  string,
  { default?: unknown }
>

const found = Object.entries(modules).filter(([path]) => !path.endsWith('.test.ts'))
const guarded = found.filter(([path]) => !path.startsWith('./auth/'))

/** Stands in for a user the guard rejects — every permission check throws 403. */
function deniedEvent(): H3Event {
  return {
    context: {
      requirePermission: () => {
        throw createError({ statusCode: 403, statusMessage: 'denied' })
      },
    },
  } as unknown as H3Event
}

describe('every /api endpoint guards itself', () => {
  it('finds the endpoint modules at all', () => {
    // Guards the guard: a broken glob would make every case below vacuous, and
    // would do it silently while the app still ships endpoints.
    expect(found.length).toBeGreaterThan(0)
  })

  it.each(guarded)('%s refuses when the guard refuses', async (_path, module) => {
    const handler = module.default as (event: H3Event) => unknown

    await expect(Promise.resolve().then(() => handler(deniedEvent()))).rejects.toSatisfy(
      (err: unknown) => isError(err) && err.statusCode === 403,
    )
  })
})
