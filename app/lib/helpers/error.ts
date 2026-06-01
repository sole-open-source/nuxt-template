export interface ApiErrorShape {
  message: string
  statusCode?: number
  data?: unknown
}

/**
 * Normaliza cualquier error a un string legible.
 * Maneja errores de ofetch, Error nativos, y strings.
 */
export function parseApiError(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>

    if (e.data && typeof e.data === 'object') {
      const d = e.data as Record<string, unknown>
      if (typeof d.detail === 'string') return d.detail
      if (typeof d.message === 'string') return d.message
      if (typeof d.error === 'string') return d.error
    }

    if (typeof (e as Error).message === 'string') return (e as Error).message
  }

  if (typeof err === 'string') return err
  return 'Error desconocido'
}

export function getErrorMessage(err: unknown): string {
  return parseApiError(err)
}
