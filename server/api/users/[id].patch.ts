/**
 * DEMO SCAFFOLDING — see `server/utils/users-store.ts`.
 */
import { UserFormSchema } from '~/features/users/schemas'
import { emailTaken, findUser, updateUser } from '~~/server/utils/users-store'

export default defineEventHandler(async (event) => {
  event.context.requirePermission('users:write')

  const id = getRouterParam(event, 'id')!
  if (!findUser(id)) {
    setResponseStatus(event, 404)
    return { status: 'NOT_FOUND', message: `No user with id ${id}.` }
  }

  const parsed = UserFormSchema.partial().safeParse(await readBody(event))
  if (!parsed.success) {
    setResponseStatus(event, 400)
    return {
      status: 'BAD_REQUEST',
      message: parsed.error.issues[0]?.message ?? 'Invalid user data.',
    }
  }

  if (parsed.data.email && emailTaken(parsed.data.email, id)) {
    setResponseStatus(event, 409)
    return { status: 'CONFLICT', message: `${parsed.data.email} is already registered.` }
  }

  return updateUser(id, parsed.data)
})
