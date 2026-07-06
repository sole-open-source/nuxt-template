export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (isPublicRoute(to.path)) {
    if (auth.isAuthenticated) {
      return navigateTo(resolveDefaultRoute(auth.user!))
    }
    return
  }

  if (auth.status === 'idle') {
    await auth.fetchCurrentUser()
  }

  if (!auth.isAuthenticated) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (!canAccessRoute(to.path, auth.user!)) {
    return navigateTo(resolveDefaultRoute(auth.user!))
  }
})
