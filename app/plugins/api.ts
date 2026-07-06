import { createApiClient } from '~/lib/api/client'
import { ACCESS_TOKEN_COOKIE } from '#shared/utils/auth-cookies'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = createApiClient(config.public.apiBase as string, () => useCookie(ACCESS_TOKEN_COOKIE).value ?? null)

  return {
    provide: { api },
  }
})
