export default defineEventHandler(async (event) => {
  const { refreshToken } = getAuthTokens(event)
  if (!refreshToken) {
    clearAuthTokens(event)
    throw createError({ statusCode: 401, statusMessage: 'No hay sesión que refrescar' })
  }

  const config = useRuntimeConfig(event)

  try {
    const response = await callExternalApi<ExternalSignInResponse>(event, config.authRefreshEndpoint, {
      method: 'POST',
      body: { refresh_token: refreshToken },
    })

    setAuthTokens(event, {
      accessToken: response.tokens.access_token,
      refreshToken: response.tokens.refresh_token,
    })

    return { user: mapExternalUser(response.user) }
  } catch (error) {
    // El backend puede no soportar refresh todavía (404) o el refresh token
    // puede ser inválido/expirado (401): en ambos casos degradamos a forzar
    // re-login, igual que el comportamiento del template legacy.
    clearAuthTokens(event)
    throw error
  }
})
