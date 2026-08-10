/**
 * The session cookies, and the only place that knows their names and options.
 *
 * Both tokens are httpOnly and share a lifetime: the template has no refresh
 * flow, so a shorter access cookie would only sign users out sooner, not buy
 * security. If your API issues short-lived access tokens, add the refresh
 * flow and split the two lifetimes together.
 *
 * The access token still reaches the browser — through the SSR payload, put
 * there by `app/plugins/auth.server.ts` — because client-side services send it
 * to the data API. The refresh token never leaves this file's cookies.
 */
import type { H3Event } from 'h3'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const OAUTH_STATE_COOKIE = 'oauth_state'

/** Long enough for the round trip to the provider, short enough to be useless later. */
const OAUTH_STATE_MAX_AGE = 60 * 10

export interface Session {
  accessToken: string
  refreshToken: string
}

export interface OAuthState {
  /** Echoed by the provider and compared on the way back. Defeats login CSRF. */
  nonce: string
  /** Encoded `?redirect=` value the user was heading to, if any. */
  redirectTo: string | null
}

function sameSite(value: string): 'lax' | 'strict' | 'none' {
  return value === 'strict' || value === 'none' ? value : 'lax'
}

function cookieOptions(event: H3Event, maxAge: number) {
  const config = useRuntimeConfig(event)
  return {
    path: '/',
    httpOnly: true,
    secure: config.authCookieSecure,
    sameSite: sameSite(config.authCookieSameSite),
    maxAge,
    ...(config.authCookieDomain ? { domain: config.authCookieDomain } : {}),
  }
}

/** Null unless both tokens are present — a half session is no session. */
export function getAuthSession(event: H3Event): Session | null {
  const accessToken = getCookie(event, ACCESS_TOKEN_COOKIE)
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE)
  if (!accessToken || !refreshToken) return null
  return { accessToken, refreshToken }
}

export function setAuthSession(event: H3Event, session: Session): void {
  const options = cookieOptions(event, useRuntimeConfig(event).authCookieMaxAge)
  setCookie(event, ACCESS_TOKEN_COOKIE, session.accessToken, options)
  setCookie(event, REFRESH_TOKEN_COOKIE, session.refreshToken, options)
}

export function clearAuthSession(event: H3Event): void {
  const options = cookieOptions(event, 0)
  deleteCookie(event, ACCESS_TOKEN_COOKIE, options)
  deleteCookie(event, REFRESH_TOKEN_COOKIE, options)
}

export function setOAuthState(event: H3Event, state: OAuthState): void {
  setCookie(
    event,
    OAUTH_STATE_COOKIE,
    JSON.stringify(state),
    cookieOptions(event, OAUTH_STATE_MAX_AGE),
  )
}

/** Reads the OAuth state and deletes it: it is valid for exactly one callback. */
export function takeOAuthState(event: H3Event): OAuthState | null {
  const raw = getCookie(event, OAUTH_STATE_COOKIE)
  deleteCookie(event, OAUTH_STATE_COOKIE, cookieOptions(event, 0))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed?.nonce !== 'string') return null
    return { nonce: parsed.nonce, redirectTo: parsed.redirectTo ?? null }
  } catch {
    return null
  }
}
