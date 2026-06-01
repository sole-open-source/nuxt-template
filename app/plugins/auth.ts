// Runs after api.ts (alphabetical order: api < auth).
// Verifies the persisted token on every app startup before any route middleware fires.
export default defineNuxtPlugin(async () => {
    const auth = useAuthStore()

    if (!auth.token) return

    try {
        await auth.fetchCurrentUser()
    } catch {
        auth.resetState()
    }
})
