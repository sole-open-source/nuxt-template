/**
 * Nombres de cookie compartidos entre cliente y servidor (Nitro).
 * access_token es legible por el cliente (necesario para adjuntar el Bearer
 * token en llamadas directas a la API externa); refresh_token es httpOnly
 * y solo se usa dentro de server/api/auth/*.
 */
export const ACCESS_TOKEN_COOKIE = 'access_token'
export const REFRESH_TOKEN_COOKIE = 'refresh_token'
