import { defineStore } from 'pinia'
import { withLoading } from '~/lib/helpers/loading'
import type { User, Session } from '~/types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

const TOKEN_COOKIE = 'auth-token'

export const useAuthStore = defineStore('auth', {
    state: () => {
        const tokenCookie = useCookie<string | null>(TOKEN_COOKIE)
        return {
            user: null as User | null,
            token: tokenCookie.value ?? null,
            // If we have a persisted token, start as idle (needs verification).
            // If not, we're unauthenticated right away.
            status: (tokenCookie.value ? 'idle' : 'unauthenticated') as AuthStatus,
            loading: false,
            error: null as string | null,
        }
    },

    getters: {
        isAuthenticated: (s) => s.status === 'authenticated',
        currentUser: (s) => s.user,
    },

    actions: {
        async login(credentials: { email: string; password: string }) {
            const { $api } = useNuxtApp()
            await withLoading(this, async () => {
                const session = await $api<Session>('/auth/login', {
                    method: 'POST',
                    body: credentials,
                })
                this._setToken(session.token)
                this.user = session.user
                this.status = 'authenticated'
            })
        },

        async logout() {
            const { $api } = useNuxtApp()
            try {
                await $api('/auth/logout', { method: 'POST' })
            } finally {
                this.resetState()
                await navigateTo('/login')
            }
        },

        async fetchCurrentUser() {
            const { $api } = useNuxtApp()
            this.status = 'loading'
            try {
                await withLoading(this, async () => {
                    this.user = await $api<User>('/auth/me')
                    this.status = 'authenticated'
                })
            } catch {
                this.status = 'unauthenticated'
            }
        },

        _setToken(token: string) {
            const cookie = useCookie<string | null>(TOKEN_COOKIE, {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                sameSite: 'lax',
            })
            cookie.value = token
            this.token = token
        },

        resetState() {
            const cookie = useCookie<string | null>(TOKEN_COOKIE)
            cookie.value = null
            this.user = null
            this.token = null
            this.status = 'unauthenticated'
            this.loading = false
            this.error = null
        },
    },
})
