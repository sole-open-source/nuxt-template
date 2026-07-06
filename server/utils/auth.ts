import type { H3Event } from 'h3'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '#shared/utils/auth-cookies'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

function cookieOptions(event: H3Event, maxAge: number, httpOnly: boolean) {
  const config = useRuntimeConfig(event)
  return {
    path: '/',
    httpOnly,
    secure: config.authCookieSecure,
    sameSite: config.authCookieSameSite as 'lax' | 'strict' | 'none',
    maxAge,
    ...(config.authCookieDomain ? { domain: config.authCookieDomain } : {}),
  }
}

/**
 * access_token: legible por el cliente (el plugin $api lo adjunta como Bearer
 * en llamadas directas a la API externa). refresh_token: httpOnly, solo se
 * lee dentro de server/api/auth/*.
 */
export function setAuthTokens(event: H3Event, tokens: AuthTokens) {
  const config = useRuntimeConfig(event)
  setCookie(event, ACCESS_TOKEN_COOKIE, tokens.accessToken, cookieOptions(event, config.authAccessTokenMaxAge, false))
  setCookie(
    event,
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    cookieOptions(event, config.authRefreshTokenMaxAge, true),
  )
}

export function getAuthTokens(event: H3Event): Partial<AuthTokens> {
  return {
    accessToken: getCookie(event, ACCESS_TOKEN_COOKIE),
    refreshToken: getCookie(event, REFRESH_TOKEN_COOKIE),
  }
}

export function clearAuthTokens(event: H3Event) {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, cookieOptions(event, 0, false))
  deleteCookie(event, REFRESH_TOKEN_COOKIE, cookieOptions(event, 0, true))
}
