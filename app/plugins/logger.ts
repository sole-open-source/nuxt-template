import { logger } from '~/lib/helpers/logger'

export default defineNuxtPlugin(() => {
  return {
    provide: { logger },
  }
})
