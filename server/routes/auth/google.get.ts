/**
 * Starts the Google OAuth flow. A Nitro route rather than an `/api/` endpoint
 * because the browser navigates to it: it answers with a redirect, not JSON.
 */
import { buildGoogleAuthUrl } from '~/features/auth/google'
import { setOAuthState } from '~~/server/utils/session'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  if (!config.public.authGoogleEnabled) {
    throw createError({ statusCode: 404, statusMessage: 'Google sign-in is not enabled.' })
  }

  const redirect = getQuery(event).redirect
  const nonce = crypto.randomUUID()

  setOAuthState(event, {
    nonce,
    redirectTo: typeof redirect === 'string' ? redirect : null,
  })

  const { origin } = getRequestURL(event)
  return sendRedirect(event, buildGoogleAuthUrl(origin, nonce, config.public.googleClientId), 302)
})
