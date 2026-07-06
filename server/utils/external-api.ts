import type { H3Event } from 'h3'
import { $fetch } from 'ofetch'
import { ApiError, normalizeError } from '~/lib/helpers/error'
import { UserRole } from '~/types/auth/roles'
import type { User } from '~/types'

export interface ExternalUser {
  id: string
  email: string
  name?: string | null
  role?: string
  roles?: string[]
  avatar?: string | null
  created_at?: string
}

export interface ExternalAuthTokens {
  access_token: string
  refresh_token: string
  expires_at?: number
}

export interface ExternalSignInResponse {
  user: ExternalUser
  tokens: ExternalAuthTokens
}

export function mapExternalUser(external: ExternalUser): User {
  const roles = external.roles ?? (external.role ? [external.role] : [])
  return {
    id: external.id,
    email: external.email,
    name: external.name ?? '',
    roles: roles.filter((role): role is UserRole =>
      (Object.values(UserRole) as string[]).includes(role),
    ),
    avatarUrl: external.avatar ?? undefined,
    createdAt: external.created_at ?? '',
  }
}

interface CallExternalApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
}

/**
 * Único punto de contacto con la API externa desde el servidor de Nuxt (BFF).
 * Normaliza cualquier error a un H3Error consistente que el cliente sabe
 * interpretar (ver lib/helpers/error.ts en el cliente).
 */
export async function callExternalApi<T>(
  event: H3Event,
  path: string,
  opts: CallExternalApiOptions = {},
): Promise<T> {
  const config = useRuntimeConfig(event)
  try {
    return await $fetch<T>(path, {
      baseURL: config.public.apiBase,
      method: opts.method ?? 'GET',
      body: opts.body as Record<string, unknown> | undefined,
      headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
  } catch (error) {
    const appError = normalizeError(error)
    const statusCode = appError instanceof ApiError && appError.statusCode > 0 ? appError.statusCode : 502
    throw createError({ statusCode, statusMessage: appError.message, data: appError })
  }
}
