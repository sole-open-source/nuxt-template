import { $fetch } from 'ofetch'

export function createApiClient(baseURL: string, getToken: () => string | null) {
  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = getToken()
      if (token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },
  })
}
