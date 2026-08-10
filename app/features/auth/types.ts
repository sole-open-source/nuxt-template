import type { User } from '~/types/user'

/** Token pair as the auth API returns it. */
export interface AuthTokensResponse {
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface SignInRequest {
  email: string
  password: string
}

/** What the external auth API answers to a sign-in. Server-side only. */
export interface SignInResponse {
  user: User
  tokens: AuthTokensResponse
}

/**
 * What this app's own `/api/auth/*` routes answer to the browser. The refresh
 * token never appears here: it stays in its httpOnly cookie, unreadable by JS.
 * The access token does, because client-side services send it to the data API.
 */
export interface SessionResponse {
  user: User
  accessToken: string
}
