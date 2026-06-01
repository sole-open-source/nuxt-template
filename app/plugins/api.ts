export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const auth = useAuthStore()

    const api = $fetch.create({
        baseURL: config.public.apiBase as string,
        onRequest({ options }) {
            if (auth.token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${auth.token}`,
                }
            }
        },
        onResponseError({ response }) {
            if (response.status === 401) {
                auth.resetState()
                navigateTo('/login')
            }
        },
    })

    return {
        provide: { api },
    }
})
