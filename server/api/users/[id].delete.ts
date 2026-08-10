/**
 * DEMO SCAFFOLDING — see `server/utils/users-store.ts`.
 */
import { deleteUser } from '~~/server/utils/users-store'

export default defineEventHandler((event) => {
  event.context.requirePermission('users:delete')

  const id = getRouterParam(event, 'id')!
  if (deleteUser(id)) {
    setResponseStatus(event, 204)
    return null
  }

  setResponseStatus(event, 404)
  return { status: 'NOT_FOUND', message: `No user with id ${id}.` }
})
