const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'

/** Google requires an exact match with the URI registered in the console. */
export const GOOGLE_CALLBACK_PATH = '/authorize'

/** Where the browser goes to start the flow. A Nitro route, not a page. */
export const GOOGLE_SIGN_IN_PATH = '/auth/google'

/**
 * `state` is echoed back by Google to the callback, where it is compared with
 * the nonce stored in a cookie. Without it, an attacker can hand a victim a
 * ready-made callback URL and sign them into the attacker's account.
 *
 * The client id is passed in rather than read here: this module is imported by
 * Nitro, where configuration comes from `useRuntimeConfig(event)`.
 */
export function buildGoogleAuthUrl(origin: string, state: string, clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}${GOOGLE_CALLBACK_PATH}`,
    response_type: 'code',
    prompt: 'select_account',
    scope: 'openid profile email',
    include_granted_scopes: 'true',
    state,
  })

  return `${GOOGLE_AUTH_ENDPOINT}?${params}`
}
