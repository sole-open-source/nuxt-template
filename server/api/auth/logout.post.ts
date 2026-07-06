export default defineEventHandler((event) => {
  clearAuthTokens(event)
  return { success: true }
})
