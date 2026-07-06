import { z } from 'zod'
import { ValidationError } from '~/lib/helpers/error'

const ChangePasswordSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(8),
  new_password_confirm: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { accessToken } = getAuthTokens(event)
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const body = await readBody(event)
  const parsed = ChangePasswordSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos inválidos',
      data: new ValidationError('Datos inválidos', fieldErrors),
    })
  }

  await callAuthApi(event, '/auth/change-password', {
    method: 'POST',
    body: parsed.data,
    token: accessToken,
  })

  return { success: true }
})
