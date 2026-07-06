import { UserRole } from '~/types/auth/roles'

/** Rutas accesibles sin sesión. Prefijo-match (incluye subrutas). */
export const PUBLIC_ROUTES = ['/login', '/register', '/authorize'] as const

/**
 * Mapa ruta (prefijo) → roles permitidos, evaluado en orden de aparición.
 * Cualquier ruta autenticada que no matchee ningún prefijo aquí solo
 * requiere sesión activa (cualquier rol).
 */
export const AUTH_ROUTE_PERMISSIONS: ReadonlyArray<{
  prefix: string
  roles: readonly UserRole[]
}> = [{ prefix: '/admin', roles: [UserRole.ADMIN] }]

/** Ruta a la que se redirige tras login cuando no hay `?redirect=` explícito. */
export const DEFAULT_ROUTE = '/dashboard'
