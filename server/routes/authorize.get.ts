/**
 * Google OAuth callback. A route, not a page: it has no UI, it only decides
 * where the browser goes next.
 */
import { AUTH_DEFAULT_REDIRECT_PATH, AUTH_LOGIN_PATH } from '~/config/app'
import { logger } from '~/core/logger'
import { decodeRedirect } from '~/features/auth/redirect'
import { signInWithGoogle } from '~~/server/utils/auth-api'
import { clearAuthSession, setAuthSession, takeOAuthState } from '~~/server/utils/session'

const FAILED_SIGN_IN = `${AUTH_LOGIN_PATH}?error=oauth`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.public.authGoogleEnabled) {
    throw createError({ statusCode: 404, statusMessage: 'Google sign-in is not enabled.' })
  }

  // Consumed even on the failure paths below: the nonce is good for one callback.
  const stored = takeOAuthState(event)
  const { code, state } = getQuery(event)

  if (typeof code !== 'string' || typeof state !== 'string' || stored?.nonce !== state) {
    logger.error('auth', new Error('Rejected Google callback: missing or mismatched OAuth state'))
    clearAuthSession(event)
    return sendRedirect(event, FAILED_SIGN_IN, 302)
  }

  try {
    const { session } = await signInWithGoogle(event, code)
    setAuthSession(event, session)
  } catch (err) {
    logger.error('auth', err)
    clearAuthSession(event)
    return sendRedirect(event, FAILED_SIGN_IN, 302)
  }

  return sendRedirect(event, decodeRedirect(stored.redirectTo) ?? AUTH_DEFAULT_REDIRECT_PATH, 302)
})
