import { z } from 'zod'
import { ValidationError } from '~/lib/helpers/error'

const LoginSchema = z.object({
  username: z.string().min(1, 'Ingresa tu usuario o correo.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
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

  const auth = await callAuthApi<AuthResponse>(event, '/auth/login/', {
    method: 'POST',
    body: parsed.data,
  })

  const tokens = extractAuthTokens(auth)
  setAuthTokens(event, tokens)
  const user = await fetchAuthUser(event, tokens.accessToken)

  return { user }
})
