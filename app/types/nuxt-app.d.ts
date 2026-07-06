import type { FetchOptions } from 'ofetch'
import type { NitroFetchRequest } from 'nitropack'
import type { logger } from '~/lib/helpers/logger'

export type ApiClient = <T = unknown>(
  request: NitroFetchRequest,
  options?: FetchOptions<'json'> & { _retried?: boolean },
) => Promise<T>

declare module '#app' {
  interface NuxtApp {
    $api: ApiClient
    $logger: typeof logger
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiClient
    $logger: typeof logger
  }
}

export {}
