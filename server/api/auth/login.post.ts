import { logger } from '~/core/logger'
import { LoginSchema } from '~/features/auth/schemas'
import { setAuthSession } from '~~/server/utils/session'
import { signIn } from '~~/server/utils/auth-api'

/**
 * Error bodies use the `{ status, message }` shape that `normalizeError` parses,
 * so failures surface as typed `AppError`s on the client.
 */
export default defineEventHandler(async (event) => {
  const parsed = LoginSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    setResponseStatus(event, 400)
    return {
      status: 'BAD_REQUEST',
      message: parsed.error.issues[0]?.message ?? 'Invalid credentials.',
    }
  }

  try {
    const { user, session } = await signIn(event, parsed.data)

    setAuthSession(event, session)

    return { user, accessToken: session.accessToken }
  } catch (err) {
    logger.error('auth', err)
    // Deliberately vague: telling them which half was wrong enumerates accounts.
    setResponseStatus(event, 401)
    return { status: 'UNAUTHORIZED', message: 'Invalid email or password.' }
  }
})
