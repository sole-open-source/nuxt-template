export default defineEventHandler(async (event) => {
  const { accessToken } = getAuthTokens(event)
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const externalUser = await callExternalApi<ExternalUser>(event, '/auth/me', { token: accessToken })
  return mapExternalUser(externalUser)
})
