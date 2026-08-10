import type { SessionResponse, SignInRequest } from '~/features/auth/types'
import { BaseService } from '~/core/service'

/**
 * The browser's half of authentication. It talks to this app's own Nitro routes,
 * never to the auth API: the tokens live in httpOnly cookies that only the
 * server can set, and keeping the exchange server-side also keeps a separately
 * hosted auth API out of CORS.
 *
 * The server's half — the code that actually calls the auth API — is
 * `server/utils/auth-api.ts`.
 */
export class AuthService extends BaseService {
  // Empty base URL: these routes are served by this app, so requests stay relative.
  constructor() {
    super('', '')
  }

  login(data: SignInRequest) {
    return this.api<SessionResponse>('/api/auth/login', { method: 'POST', body: data })
  }

  logout() {
    return this.api('/api/auth/logout', { method: 'POST' })
  }

  getMe() {
    return this.api<SessionResponse>('/api/auth/me')
  }
}
