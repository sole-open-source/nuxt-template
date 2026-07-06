import { z } from 'zod'
import { ValidationError } from '~/lib/helpers/error'

const RegisterSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos de registro inválidos',
      data: new ValidationError('Datos de registro inválidos', fieldErrors),
    })
  }

  const { name, email, password } = parsed.data

  const response = await callExternalApi<ExternalSignInResponse>(event, '/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })

  setAuthTokens(event, {
    accessToken: response.tokens.access_token,
    refreshToken: response.tokens.refresh_token,
  })

  return { user: mapExternalUser(response.user) }
})
