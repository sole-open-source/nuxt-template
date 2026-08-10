import type { User } from '~/types/user'

/**
 * What the login form collects. The browser sends this to *this app*, never to
 * the auth API — `server/utils/auth-api.ts` is what translates it to whatever
 * the backend expects.
 */
export interface SignInRequest {
  email: string
  password: string
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
