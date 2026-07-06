export default defineEventHandler(async (event) => {
  const { accessToken } = getAuthTokens(event)
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  return await fetchAuthUser(event, accessToken)
})
