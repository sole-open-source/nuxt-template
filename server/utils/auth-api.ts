/**
 * The server's half of authentication: the only code that talks to the auth API.
 *
 * It is separate from `app/features/auth/services/auth.ts` because they call
 * different APIs. The browser calls this app (`/api/auth/*`) so the tokens can
 * live in httpOnly cookies; this app calls the real auth backend. Two callers,
 * two APIs, two services — collapsing them would mean shipping the auth API's
 * URL and shape to the browser for no gain.
 *
 * The auth API may live on its own host, so it gets its own base URL and falls
 * back to the data API when `authApiBaseUrl` is unset — the single-backend case.
 */
import type { H3Event } from 'h3'
import type { SignInRequest, SignInResponse } from '~/features/auth/types'
import type { User } from '~/types/user'

function authBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event)
  return config.authApiBaseUrl || config.public.apiBaseUrl
}

export function signIn(event: H3Event, credentials: SignInRequest): Promise<SignInResponse> {
  return $fetch<SignInResponse>('/auth/login', {
    baseURL: authBaseUrl(event),
    method: 'POST',
    body: credentials,
  })
}

export function signInWithGoogle(event: H3Event, code: string): Promise<SignInResponse> {
  return $fetch<SignInResponse>('/auth/google/login', {
    baseURL: authBaseUrl(event),
    method: 'POST',
    body: { code },
  })
}

/**
 * Asks the backend who this token belongs to. This is both the session check
 * and how the app learns the user's current role: verifying a JWT locally would
 * need its signing key and would still trust a role frozen at issue time.
 */
export function fetchMe(event: H3Event, accessToken: string): Promise<User> {
  return $fetch<User>('/auth/me', {
    baseURL: authBaseUrl(event),
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
