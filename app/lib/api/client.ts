import { $fetch } from 'ofetch'

export function createApiClient(baseURL: string, getToken: () => string | null) {
  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },
  })
}
