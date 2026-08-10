/**
 * DEMO SCAFFOLDING — see `server/utils/users-store.ts`.
 *
 * Error bodies use the `{ status, message }` shape that `normalizeError` parses,
 * so failures surface as typed `AppError`s on the client.
 */
import { UserFormSchema } from '~/features/users/schemas'
import { createUser, emailTaken } from '~~/server/utils/users-store'

export default defineEventHandler(async (event) => {
  event.context.requirePermission('users:write')

  const parsed = UserFormSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    setResponseStatus(event, 400)
    return {
      status: 'BAD_REQUEST',
      message: parsed.error.issues[0]?.message ?? 'Invalid user data.',
    }
  }

  if (emailTaken(parsed.data.email)) {
    setResponseStatus(event, 409)
    return { status: 'CONFLICT', message: `${parsed.data.email} is already registered.` }
  }

  setResponseStatus(event, 201)
  return createUser(parsed.data)
})
