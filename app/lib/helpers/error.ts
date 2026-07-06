export type ErrorCode =
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BAD_REQUEST'
  | 'SERVER_ERROR'
  | 'VALIDATION'
  | 'UNKNOWN'

export interface ApiErrorShape {
  message: string
  statusCode?: number
  data?: unknown
}

export class AppError extends Error {
  readonly code: ErrorCode

  constructor(message: string, code: ErrorCode = 'UNKNOWN') {
    super(message)
    this.name = 'AppError'
    this.code = code
  }

  is(code: ErrorCode): boolean {
    return this.code === code
  }

  isAuth(): boolean {
    return this.code === 'UNAUTHORIZED' || this.code === 'FORBIDDEN'
  }

  isNetwork(): boolean {
    return this.code === 'NETWORK'
  }
}

export class ApiError extends AppError {
  readonly statusCode: number
  readonly data?: unknown

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message, statusCodeToErrorCode(statusCode))
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
  }
}

export class ValidationError extends AppError {
  readonly fieldErrors: Record<string, string[]>

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message, 'VALIDATION')
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

function statusCodeToErrorCode(statusCode: number): ErrorCode {
  if (statusCode === 0) return 'NETWORK'
  if (statusCode === 401) return 'UNAUTHORIZED'
  if (statusCode === 403) return 'FORBIDDEN'
  if (statusCode === 404) return 'NOT_FOUND'
  if (statusCode === 409) return 'CONFLICT'
  if (statusCode === 400 || statusCode === 422) return 'BAD_REQUEST'
  if (statusCode >= 500) return 'SERVER_ERROR'
  return 'UNKNOWN'
}

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (typeof d.message === 'string') return d.message
    if (typeof d.detail === 'string') return d.detail
    if (typeof d.error === 'string') return d.error
  }
  return fallback
}

/**
 * Normaliza cualquier error (ofetch FetchError, Error nativo, string, AppError)
 * a una instancia tipada de AppError/ApiError. Único punto de entrada para
 * interpretar errores de red o de la API en toda la app.
 */
export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err

  if (err instanceof Error) {
    const e = err as Error & { statusCode?: number; data?: unknown; response?: { status?: number } }
    const statusCode = typeof e.statusCode === 'number' ? e.statusCode : e.response?.status

    if (typeof statusCode === 'number') {
      return new ApiError(
        statusCode,
        extractMessage(e.data, e.message || 'Ocurrió un error inesperado'),
        e.data,
      )
    }

    return new AppError(e.message, 'NETWORK')
  }

  if (typeof err === 'string') return new AppError(err)
  return new AppError('Error desconocido')
}

/**
 * Normaliza cualquier error a un string legible.
 * Maneja errores de ofetch, Error nativos, y strings.
 */
export function parseApiError(err: unknown): string {
  return normalizeError(err).message
}

export function getErrorMessage(err: unknown): string {
  return parseApiError(err)
}
