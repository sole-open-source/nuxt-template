/**
 * The auth state of the client, held in `useState` — that is, per request.
 *
 * Never a module-level `ref`: on the server modules are singletons per process,
 * so that would leak one user's session into another user's page. `useState` is
 * created per request and serialized into the payload, which is how the value
 * the server resolved reaches the browser (see `app/plugins/auth.server.ts`).
 */
import type { Permission } from '~/config/permissions'
import type { SignInRequest } from '~/features/auth/types'
import type { User } from '~/types/user'
import { AUTH_LOGIN_PATH } from '~/config/app'
import { ROLE_PERMISSIONS } from '~/config/permissions'
import { hasPermission } from '~/core/permissions'
import { AuthService } from '~/features/auth/services/auth'

export interface AuthState {
  user: User | null
  /**
   * Sent as a Bearer token by client-side services. The refresh token is not
   * here and never is: it stays in its httpOnly cookie.
   */
  accessToken: string | null
}

export function useAuthState() {
  return useState<AuthState>('auth', () => ({ user: null, accessToken: null }))
}

export function useAuth() {
  const state = useAuthState()

  const user = computed(() => state.value.user)
  const accessToken = computed(() => state.value.accessToken)
  const isAuthenticated = computed(() => state.value.user !== null)

  /**
   * Presentation only — hiding a link is not access control. The route
   * middleware enforces pages and each endpoint enforces itself.
   */
  function can(permission: Permission): boolean {
    return hasPermission(ROLE_PERMISSIONS, state.value.user?.role, permission)
  }

  async function signIn(credentials: SignInRequest): Promise<void> {
    const session = await new AuthService().login(credentials)
    state.value = { user: session.user, accessToken: session.accessToken }
  }

  /** Clears local state even if the server call fails: the cookies outlive a network blip, the UI should not. */
  async function signOut(): Promise<void> {
    try {
      await new AuthService().logout()
    } finally {
      state.value = { user: null, accessToken: null }
      await navigateTo(AUTH_LOGIN_PATH)
    }
  }

  return { state, user, accessToken, isAuthenticated, can, signIn, signOut }
}
