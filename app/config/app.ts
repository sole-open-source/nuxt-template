/**
 * The half of the configuration that is not environment-driven.
 *
 * Everything here changes once per project, not once per deploy — so it is a
 * plain module, importable from anywhere including Nitro, with no `useRuntimeConfig()`
 * and no context to be inside of.
 *
 * The env-driven half lives in `runtimeConfig` (`nuxt.config.ts`) and is read
 * with `useRuntimeConfig()`: API base URLs, the auth feature flags and the
 * cookie options. That split is the Nuxt idiom, and it is also the honest one —
 * a value you would never change per environment does not belong in `.env`.
 */
export const APP_BRANDING = {
  name: 'App',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  seo: {
    title: 'App',
    description: '',
  },
} as const

/** Where an anonymous visitor is sent, and where a completed sign-in lands. */
export const AUTH_LOGIN_PATH = '/login'
export const AUTH_DEFAULT_REDIRECT_PATH = '/'
