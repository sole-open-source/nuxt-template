import { z } from 'zod'
import { ValidationError } from '~/lib/helpers/error'

const RegisterSchema = z
  .object({
    username: z.string().min(1, 'El usuario o correo es obligatorio.').max(150),
    password: z.string().min(8, 'Debe tener al menos 8 caracteres.').max(128),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
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

  const { username, password, confirmPassword } = parsed.data

  const auth = await callAuthApi<AuthResponse>(event, '/auth/registration/', {
    method: 'POST',
    body: {
      username,
      email: looksLikeEmail(username) ? username : undefined,
      password1: password,
      password2: confirmPassword,
    },
  })

  const tokens = extractAuthTokens(auth)
  setAuthTokens(event, tokens)
  const user = await fetchAuthUser(event, tokens.accessToken)

  return { user }
})
