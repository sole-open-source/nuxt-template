/**
 * DEMO SCAFFOLDING — see `server/utils/users-store.ts`.
 *
 * Three methods on this path, three permissions: this is the granularity a
 * path-keyed table cannot express, which is why endpoints guard themselves.
 */
import { findUser } from '~~/server/utils/users-store'

export default defineEventHandler((event) => {
  event.context.requirePermission('users:read')

  const id = getRouterParam(event, 'id')!
  const user = findUser(id)
  if (user) return user

  setResponseStatus(event, 404)
  return { status: 'NOT_FOUND', message: `No user with id ${id}.` }
})
