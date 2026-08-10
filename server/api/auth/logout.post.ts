import { clearAuthSession } from '~~/server/utils/session'

/**
 * POST only. As a GET this would run on link prefetch — or on an injected
 * `<img src="/api/auth/logout">` — and sign the user out on its own.
 */
export default defineEventHandler((event) => {
  clearAuthSession(event)
  setResponseStatus(event, 204)
  return null
})
