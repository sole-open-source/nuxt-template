import { parseApiError } from '~/lib/helpers/error'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (err, instance, info) => {
        nuxtApp.$logger.error('Vue error', {
            error: parseApiError(err),
            info,
            component: instance?.$options?.name ?? 'unknown',
        })
    })

    nuxtApp.hook('app:error', (err) => {
        nuxtApp.$logger.error('App error', { error: parseApiError(err) })
    })
})
