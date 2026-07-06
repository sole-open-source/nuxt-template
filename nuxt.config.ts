import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@nuxt/hints',
  ],

  css: ['~/assets/css/tailwind.css'],

  // Los auto-imports de Nuxt por defecto solo escanean el nivel superior de
  // composables/ y stores/ (no subcarpetas). Este proyecto organiza ambos
  // por dominio (composables/features/[domain]/, stores/[domain]/), así que
  // se necesitan patrones recursivos explícitos para que se auto-importen.
  imports: {
    dirs: ['composables/**', 'stores/**'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },

  runtimeConfig: {
    authCookieDomain: process.env.AUTH_COOKIE_DOMAIN ?? '',
    authCookieSecure: process.env.AUTH_COOKIE_SECURE !== 'false',
    authCookieSameSite: (process.env.AUTH_COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? 'lax',
    authAccessTokenMaxAge: Number(process.env.AUTH_ACCESS_TOKEN_MAX_AGE ?? 60 * 15),
    authRefreshTokenMaxAge: Number(process.env.AUTH_REFRESH_TOKEN_MAX_AGE ?? 60 * 60 * 24 * 7),
    authRefreshEndpoint: process.env.AUTH_REFRESH_ENDPOINT ?? '/auth/refresh',
    public: {
      apiBase: process.env.API_BASE_URL ?? '',
    },
  },
})
