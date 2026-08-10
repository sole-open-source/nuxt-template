/**
 * The auth API contract, and the only file in the app that knows it.
 *
 * Everything the backend's shape touches lives here: the endpoint paths, the
 * types the wire actually carries (`External*`), and the two functions that
 * translate them into the app's own `User` and `Session`. Nothing outside this
 * file — no endpoint, no middleware, and certainly nothing in `app/` — ever sees
 * an `access_token` or a raw backend field.
 *
 * That seam is the point. Pointing this template at a different backend is
 * editing the constants and the mappers below, and the type checker tells you
 * when you are done. Without it, `$fetch<User>(...)` would simply *assert* that
 * the response is a `User`: a backend answering `{ pk, groups }` would compile
 * fine, leave `user.role` undefined at runtime, and 403 every request with
 * nothing pointing at the cause.
 *
 * It is separate from `app/features/auth/services/auth.ts` because they call
 * different APIs. The browser calls this app (`/api/auth/*`) so the tokens can
 * live in httpOnly cookies; this app calls the real auth backend.
 */
import type { H3Event } from 'h3'
import type { SignInRequest } from '~/features/auth/types'
import type { User, UserRole } from '~/types/user'
import type { Session } from '~~/server/utils/session'

// ─── The contract ────────────────────────────────────────────────────────────
// Change these to match your backend. They are the whole surface.

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  googleLogin: '/auth/google/login',
  me: '/auth/me',
} as const

/**
 * The user as the wire carries it. `role` is `string`, not `UserRole`: the
 * backend can send anything, and pretending otherwise is how an unknown role
 * becomes an invisible bug instead of a denied request.
 */
interface ExternalUser {
  id: string | number
  email: string
  name?: string | null
  role: string
  avatar?: string | null
  created_at: string
  updated_at: string
}

interface ExternalTokens {
  access_token: string
  refresh_token: string
  expires_at?: number
}

interface ExternalSignInResponse {
  user: ExternalUser
  tokens: ExternalTokens
}

// ─── The mapping ─────────────────────────────────────────────────────────────

export function toUser(external: ExternalUser): User {
  return {
    id: String(external.id),
    email: external.email,
    name: external.name ?? null,
    // Deliberately NOT validated against UserRole. An unrecognised role has to
    // reach the app verbatim: ROLE_PERMISSIONS has no entry for it, so it holds
    // nothing and is denied. Coercing it to a default would silently grant
    // whatever that default happens to hold — the one mapping mistake here that
    // is a security incident rather than a bug.
    role: external.role as UserRole,
    avatar: external.avatar ?? null,
    created_at: external.created_at,
    updated_at: external.updated_at,
  }
}

/** Drops everything that is not a token: the session is two strings, nothing else. */
export function toSession(external: ExternalTokens): Session {
  return {
    accessToken: external.access_token,
    refreshToken: external.refresh_token,
  }
}

// ─── The calls ───────────────────────────────────────────────────────────────

export interface SignInResult {
  user: User
  session: Session
}

/**
 * The auth API may live on its own host, so it gets its own base URL and falls
 * back to the data API when `authApiBaseUrl` is unset — the single-backend case.
 */
function authBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event)
  return config.authApiBaseUrl || config.public.apiBaseUrl
}

export async function signIn(event: H3Event, credentials: SignInRequest): Promise<SignInResult> {
  const response = await $fetch<ExternalSignInResponse>(AUTH_ENDPOINTS.login, {
    baseURL: authBaseUrl(event),
    method: 'POST',
    // The request half of the contract. A backend that wants `username` instead
    // of `email` is renamed here, not in the login form.
    body: { email: credentials.email, password: credentials.password },
  })

  return { user: toUser(response.user), session: toSession(response.tokens) }
}

export async function signInWithGoogle(event: H3Event, code: string): Promise<SignInResult> {
  const response = await $fetch<ExternalSignInResponse>(AUTH_ENDPOINTS.googleLogin, {
    baseURL: authBaseUrl(event),
    method: 'POST',
    body: { code },
  })

  return { user: toUser(response.user), session: toSession(response.tokens) }
}

/**
 * Asks the backend who this token belongs to. This is both the session check
 * and how the app learns the user's current role: verifying a JWT locally would
 * need its signing key and would still trust a role frozen at issue time.
 */
export async function fetchMe(event: H3Event, accessToken: string): Promise<User> {
  const response = await $fetch<ExternalUser>(AUTH_ENDPOINTS.me, {
    baseURL: authBaseUrl(event),
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return toUser(response)
}
