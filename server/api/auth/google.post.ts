import { z } from 'zod'

const GoogleLoginSchema = z.object({
  code: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = GoogleLoginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el código de Google' })
  }

  const auth = await callAuthApi<AuthResponse>(event, '/auth/google/login', {
    method: 'POST',
    body: parsed.data,
  })

  const tokens = extractAuthTokens(auth)
  setAuthTokens(event, tokens)
  const user = await fetchAuthUser(event, tokens.accessToken)

  return { user }
})
