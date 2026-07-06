export default defineEventHandler(async (event) => {
  const { accessToken } = getAuthTokens(event)

  if (accessToken) {
    // Best-effort: si el backend ya expiró la sesión o no responde, igual
    // limpiamos las cookies locales — nunca debe bloquear el logout.
    await callAuthApi(event, '/auth/logout/', { method: 'POST', token: accessToken }).catch(
      () => null,
    )
  }

  clearAuthTokens(event)
  return { success: true }
})
