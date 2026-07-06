export default defineEventHandler(async (event) => {
  const { refreshToken } = getAuthTokens(event)
  if (!refreshToken) {
    clearAuthTokens(event)
    throw createError({ statusCode: 401, statusMessage: 'No hay sesión que refrescar' })
  }

  const config = useRuntimeConfig(event)

  try {
    const auth = await callAuthApi<AuthResponse>(event, config.authRefreshEndpoint, {
      method: 'POST',
      body: { refresh: refreshToken },
    })

    const tokens = extractAuthTokens(auth, refreshToken)
    setAuthTokens(event, tokens)
    const user = await fetchAuthUser(event, tokens.accessToken)

    return { user }
  } catch (error) {
    // El backend puede no soportar refresh todavía (404) o el refresh token
    // puede ser inválido/expirado (401): en ambos casos degradamos a forzar
    // re-login, igual que el comportamiento del template legacy.
    clearAuthTokens(event)
    throw error
  }
})
