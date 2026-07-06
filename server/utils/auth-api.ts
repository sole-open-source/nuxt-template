import type { H3Event } from 'h3'
import { $fetch } from 'ofetch'
import { ApiError, normalizeError } from '~/lib/helpers/error'
import { UserRole } from '~/types/auth/roles'
import type { User } from '~/types'

/**
 * Shape real de la API de auth (dj-rest-auth + SimpleJWT): login, registro y
 * refresh devuelven access/refresh planos, sin objeto `user` embebido.
 */
export interface AuthResponse {
  access: string
  /** Ausente si el backend no rota el refresh token en /auth/token/refresh/. */
  refresh?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Único punto de mapeo entre el shape de la API de auth y el interno de la
 * app. Si el backend cambia los nombres de campo, este es el único lugar a
 * tocar. `previousRefreshToken` cubre el caso de /auth/token/refresh/, que
 * puede no devolver un refresh nuevo si la rotación está desactivada.
 */
export function extractAuthTokens(response: AuthResponse, previousRefreshToken = ''): AuthTokens {
  return {
    accessToken: response.access,
    refreshToken: response.refresh ?? previousRefreshToken,
  }
}

/** UserDetailsSerializer de dj-rest-auth (GET /auth/user/): el rol vive en `groups`. */
export interface ExternalUser {
  pk: number | string
  username: string
  email?: string
  first_name?: string
  last_name?: string
  groups?: string[]
}

export function mapExternalUser(external: ExternalUser): User {
  const fullName = [external.first_name, external.last_name].filter(Boolean).join(' ').trim()
  const groups = external.groups ?? []
  return {
    id: String(external.pk),
    email: external.email ?? '',
    name: fullName || external.username,
    roles: groups.filter((group): group is UserRole =>
      (Object.values(UserRole) as string[]).includes(group),
    ),
    avatarUrl: undefined,
    createdAt: '',
  }
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

interface CallAuthApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
}

/**
 * Único punto de contacto con la API de autenticación desde el servidor de
 * Nuxt. Nunca se llama desde el navegador (evita CORS contra un host de auth
 * separado) y normaliza cualquier error a un H3Error consistente (ver
 * lib/helpers/error.ts en el cliente).
 */
export async function callAuthApi<T>(
  event: H3Event,
  path: string,
  opts: CallAuthApiOptions = {},
): Promise<T> {
  const config = useRuntimeConfig(event)
  try {
    return await $fetch<T>(path, {
      baseURL: config.authApiBase,
      method: opts.method ?? 'GET',
      body: opts.body as Record<string, unknown> | undefined,
      headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
  } catch (error) {
    const appError = normalizeError(error)
    const statusCode =
      appError instanceof ApiError && appError.statusCode > 0 ? appError.statusCode : 502
    throw createError({ statusCode, statusMessage: appError.message, data: appError })
  }
}

/** login/register/refresh solo devuelven tokens: el user se pide aparte. */
export async function fetchAuthUser(event: H3Event, accessToken: string): Promise<User> {
  const external = await callAuthApi<ExternalUser>(event, '/auth/user/', { token: accessToken })
  return mapExternalUser(external)
}
