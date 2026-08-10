/**
 * Hands the session the server middleware resolved to the Vue app.
 *
 * `useState` is serialized into the payload, so this is also how the user and
 * the access token reach the browser — without a second round trip and without
 * a module-level ref that would be shared by every request in the process.
 */
export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const state = useAuthState()

  state.value = {
    user: event?.context.user ?? null,
    accessToken: event?.context.accessToken ?? null,
  }
})
