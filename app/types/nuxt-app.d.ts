import type { $Fetch } from 'ofetch'
import type { logger } from '~/lib/helpers/logger'

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
    $logger: typeof logger
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: $Fetch
    $logger: typeof logger
  }
}

export {}
