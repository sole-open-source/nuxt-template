import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', 'shadcn-nuxt', '@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/color-mode'],

  css: ['~/assets/css/tailwind.css'],

  // Nuxt prefixes a component's name with its folder path by default
  // (components/layout/AppSidebar.vue -> <LayoutAppSidebar>). The pyramid is
  // already legible from the folder, so the prefix is turned off and components
  // are used under their own name. `ui/` is handled by shadcn-nuxt.
  //
  // Feature components (`app/features/<slice>/components/`) are deliberately not
  // auto-imported: they belong to one slice, and importing them by path is what
  // keeps that visible at the call site.
  // Gandalf va primero: si un día un `G*` de kit y uno de base comparten nombre,
  // gana el más compuesto, que es el que quieres usar.
  components: [
    { path: '~/components/gandalf/kit', pathPrefix: false },
    { path: '~/components/gandalf/base', pathPrefix: false },
    { path: '~/components/blocks', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
  ],

  // Class-free dark mode toggling: the class goes on <html> with no suffix, so
  // Tailwind's `dark:` variant works and there is no flash before hydration.
  colorMode: {
    classSuffix: '',
  },

  /**
   * The environment-driven half of the configuration. The other half — branding,
   * the login path — is in `app/config/app.ts`, because it changes once per
   * project rather than once per deploy.
   *
   * Every key here is overridable by an env var: `NUXT_PUBLIC_API_BASE_URL`,
   * `NUXT_AUTH_COOKIE_SECURE`, and so on. See `.env.example`.
   */
  runtimeConfig: {
    // Server-only: the auth API may live on its own host, and the browser never
    // calls it — everything goes through `server/api/auth/*`. Empty falls back
    // to the data API.
    authApiBaseUrl: '',
    authCookieDomain: '',
    authCookieSecure: true,
    authCookieSameSite: 'lax',
    authCookieMaxAge: 60 * 60 * 24 * 7,

    public: {
      apiBaseUrl: '',
      authEnabled: true,
      authPasswordEnabled: true,
      authGoogleEnabled: false,
      googleClientId: '',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
})
