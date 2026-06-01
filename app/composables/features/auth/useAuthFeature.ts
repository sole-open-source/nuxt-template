import type { AsyncViewState } from '~/types/ui/view-state'

export function useAuthFeature() {
  const store = useAuthStore()

  const viewState = computed((): AsyncViewState => {
    if (store.loading) return 'loading'
    if (store.error) return 'error'
    if (!store.user) return 'idle'
    return 'success'
  })

  async function login(credentials: { email: string; password: string }) {
    await store.login(credentials)
    await navigateTo('/dashboard')
  }

  async function logout() {
    await store.logout()
  }

  return {
    viewState,
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    error: computed(() => store.error),
    login,
    logout,
  }
}
