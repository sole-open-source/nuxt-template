/**
 * DEMO SCAFFOLDING — stands in for your real users endpoint. See
 * `server/utils/users-store.ts`. Delete both when you point at a real backend.
 *
 * Endpoints get no layout, so each handler guards itself, asking for what it
 * actually does: listing is not creating.
 */
import { listUsers } from '~~/server/utils/users-store'

export default defineEventHandler((event) => {
  event.context.requirePermission('users:read')

  const search = getQuery(event).q
  return listUsers(typeof search === 'string' ? search : undefined)
})
