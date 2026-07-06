import { defineStore } from 'pinia'
import { withLoading } from '~/lib/helpers/loading'
import { ACCESS_TOKEN_COOKIE } from '#shared/utils/auth-cookies'
import type { User } from '~/types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export interface LoginCredentials {
  /** Usuario o correo — el backend de auth acepta ambos bajo este campo. */
  username: string
  password: string
}

export interface RegisterPayload {
  /** Usuario o correo — se usa como username; si parece un correo, también se envía como email. */
  username: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
  new_password_confirm: string
}

/**
 * La sesión vive en cookies gestionadas por server/api/auth/* (BFF): el
 * access_token es legible por el cliente para llamadas directas a la API
 * externa, el refresh_token es httpOnly. Este store solo refleja el estado
 * derivado (usuario + status), nunca guarda los tokens en memoria.
 */
export const useAuthStore = defineStore('auth', {
  state: () => {
    // El access_token es legible por el cliente: si no existe, ni siquiera
    // vale la pena hacer el round-trip a /api/auth/me al arrancar.
    const hasAccessToken = !!useCookie(ACCESS_TOKEN_COOKIE).value
    return {
      user: null as User | null,
      status: (hasAccessToken ? 'idle' : 'unauthenticated') as AuthStatus,
      loading: false,
      error: null as string | null,
    }
  },

  getters: {
    isAuthenticated: (s) => s.status === 'authenticated',
    currentUser: (s) => s.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      await withLoading(this, async () => {
        const { user } = await $fetch<{ user: User }>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        })
        this.user = user
        this.status = 'authenticated'
      })
    },

    async register(payload: RegisterPayload) {
      await withLoading(this, async () => {
        const { user } = await $fetch<{ user: User }>('/api/auth/register', {
          method: 'POST',
          body: payload,
        })
        this.user = user
        this.status = 'authenticated'
      })
    },

    async loginWithGoogle(code: string) {
      await withLoading(this, async () => {
        const { user } = await $fetch<{ user: User }>('/api/auth/google', {
          method: 'POST',
          body: { code },
        })
        this.user = user
        this.status = 'authenticated'
      })
    },

    /** Sin UI propia todavía — expuesto para paridad de superficie con el AuthService del template. */
    async changePassword(payload: ChangePasswordPayload) {
      await withLoading(this, async () => {
        await $fetch('/api/auth/change-password', { method: 'POST', body: payload })
      })
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } finally {
        this.resetState()
        await navigateTo('/login')
      }
    },

    /** Revalida la sesión contra el servidor (usada por el middleware global). */
    async fetchCurrentUser() {
      this.status = 'loading'
      try {
        this.user = await $fetch<User>('/api/auth/me')
        this.status = 'authenticated'
      } catch {
        const refreshed = await this.tryRefresh()
        if (!refreshed) {
          this.user = null
          this.status = 'unauthenticated'
        }
      }
    },

    /** Intenta renovar la sesión vía refresh token. Nunca lanza. */
    async tryRefresh(): Promise<boolean> {
      try {
        const { user } = await $fetch<{ user: User }>('/api/auth/refresh', { method: 'POST' })
        this.user = user
        this.status = 'authenticated'
        return true
      } catch {
        this.user = null
        this.status = 'unauthenticated'
        return false
      }
    },

    resetState() {
      this.user = null
      this.status = 'unauthenticated'
      this.loading = false
      this.error = null
    },
  },
})
