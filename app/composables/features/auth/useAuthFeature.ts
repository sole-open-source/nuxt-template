import type { AsyncViewState } from '~/types/ui/view-state'
import type { LoginCredentials, RegisterPayload } from '~/stores/auth/useAuthStore'

export function useAuthFeature() {
  const store = useAuthStore()
  const route = useRoute()
  const config = useRuntimeConfig()

  const viewState = computed((): AsyncViewState => {
    if (store.loading) return 'loading'
    if (store.error) return 'error'
    if (!store.user) return 'idle'
    return 'success'
  })

  function resolveRedirectTarget(): string {
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) return redirect
    return store.user ? resolveDefaultRoute(store.user) : '/dashboard'
  }

  async function login(credentials: LoginCredentials) {
    await store.login(credentials)
    await navigateTo(resolveRedirectTarget())
  }

  async function register(payload: RegisterPayload) {
    await store.register(payload)
    await navigateTo(resolveRedirectTarget())
  }

  /** Redirige al consentimiento de Google; el flujo termina en /authorize. */
  function redirectToGoogle() {
    const params = new URLSearchParams({
      client_id: config.public.googleClientId as string,
      redirect_uri: `${window.location.origin}/authorize`,
      response_type: 'code',
      scope: 'openid profile email',
      prompt: 'select_account',
      include_granted_scopes: 'true',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async function loginWithGoogle(code: string) {
    await store.loginWithGoogle(code)
    await navigateTo(resolveRedirectTarget())
  }

  async function logout() {
    await store.logout()
  }

  return {
    viewState,
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    error: computed(() => store.error),
    googleEnabled: computed(() => config.public.authGoogleEnabled as boolean),
    login,
    register,
    redirectToGoogle,
    loginWithGoogle,
    logout,
  }
}
