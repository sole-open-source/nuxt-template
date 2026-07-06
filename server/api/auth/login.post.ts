import { z } from 'zod'
import { ValidationError } from '~/lib/helpers/error'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>
    throw createError({
      statusCode: 400,
      statusMessage: 'Credenciales inválidas',
      data: new ValidationError('Credenciales inválidas', fieldErrors),
    })
  }

  const response = await callExternalApi<ExternalSignInResponse>(event, '/auth/login', {
    method: 'POST',
    body: parsed.data,
  })

  setAuthTokens(event, {
    accessToken: response.tokens.access_token,
    refreshToken: response.tokens.refresh_token,
  })

  return { user: mapExternalUser(response.user) }
})
