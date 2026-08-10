/**
 * BaseService — wires a service to an API client with token resolution.
 *
 * Decoupled from auth: the token is supplied via the constructor. Services that
 * need auth receive it from the caller (a component reading `useAuth()`) rather
 * than reading a global store.
 *
 * Subclasses call `this.api<T>(path, { method, body, query })` directly — it is
 * an ofetch instance, so the options are ofetch's.
 *
 * `baseUrl` exists because auth and data can live on different hosts: a service
 * overrides it to target another API, and passes `''` to stay on this app's own
 * Nitro routes. Omit it to use `runtimeConfig.public.apiBaseUrl`.
 *
 * Instantiate services inside `setup()` or a composable, never at module scope:
 * the default base URL comes from `useRuntimeConfig()`, which needs the Nuxt
 * context — and a service built once per process would be shared across
 * requests, token and all.
 *
 * @example
 * const auth = useAuth()
 * const reports = new ReportsService(() => auth.accessToken.value)
 */
import type { ApiClient } from '~/core/api'
import { createApiClient } from '~/core/api'

export class BaseService {
  protected api: ApiClient

  constructor(token: string | (() => string | null) = '', baseUrl?: string) {
    // Each service gets its own client so the getToken closure resolves correctly.
    this.api = createApiClient({
      baseUrl: baseUrl ?? useRuntimeConfig().public.apiBaseUrl,
      getToken: () => (typeof token === 'function' ? token() : token),
    })
  }
}
