import type { FetchOptions } from 'ofetch'
import type { NitroFetchRequest } from 'nitropack'
import { createApiClient } from '~/lib/api/client'
import { normalizeError } from '~/lib/helpers/error'
import { ACCESS_TOKEN_COOKIE } from '#shared/utils/auth-cookies'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const request = createApiClient(
    config.public.apiBase as string,
    () => useCookie(ACCESS_TOKEN_COOKIE).value ?? null,
  )

  async function api<T = unknown>(
    url: NitroFetchRequest,
    options: FetchOptions<'json'> & { _retried?: boolean } = {},
  ): Promise<T> {
    try {
      return await request<T>(url, options)
    } catch (error) {
      const appError = normalizeError(error)

      if (appError.is('UNAUTHORIZED') && !options._retried) {
        const auth = useAuthStore()
        const refreshed = await auth.tryRefresh()
        if (refreshed) {
          return api<T>(url, { ...options, _retried: true })
        }
        await auth.logout()
      }

      throw appError
    }
  }

  return {
    provide: { api },
  }
})
