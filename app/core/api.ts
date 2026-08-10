/**
 * API client factory, backed by ofetch — the same `$fetch` Nuxt uses, so a
 * relative URL called during SSR reaches this app's own Nitro routes without a
 * round trip over the network.
 *
 * Usage:
 *   import { createApiClient } from '~/core/api'
 *   const client = createApiClient({ getToken: () => auth.accessToken.value })
 */
export type ApiClient = ReturnType<typeof $fetch.create>

export interface ApiClientOptions {
  baseUrl?: string
  /** Called on every request so a refreshed token is always picked up. */
  getToken?: () => string | null
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const { baseUrl = '', getToken } = options

  return $fetch.create({
    baseURL: baseUrl,
    onRequest({ options }) {
      const token = getToken?.()
      if (!token) return

      const headers = new Headers(options.headers)
      headers.set('Authorization', `Bearer ${token}`)
      options.headers = headers
    },
  })
}
