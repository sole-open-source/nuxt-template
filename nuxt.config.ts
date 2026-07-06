import tailwindcss from '@tailwindcss/vite'

// $fetch/ofetch en Node requiere una URL absoluta; si el .env trae un
// hostname pelado (ej. "api.example.com") lo normaliza en vez de fallar.
function withProtocol(url: string): string {
  if (!url || /^https?:\/\//.test(url)) return url
  return `https://${url}`
}

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

  // Por defecto Nuxt antepone la ruta de la carpeta al nombre del componente
  // (components/domain/auth/LoginForm.vue -> <DomainAuthLoginForm>). Este
  // proyecto usa nombres planos (<LoginForm>, <AppSidebar>) según la
  // pirámide de componentes de la arquitectura, así que se desactiva el
  // prefijo para cada carpeta de la pirámide (ui/ ya lo maneja shadcn-nuxt).
  components: [
    { path: '~/components/base', pathPrefix: false },
    { path: '~/components/common', pathPrefix: false },
    { path: '~/components/patterns', pathPrefix: false },
    { path: '~/components/domain', pathPrefix: false },
  ],

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
    // Server-only: la API de auth puede vivir en un host distinto al de
    // negocio (igual que en el template legacy). Nunca se llama desde el
    // navegador -todo pasa por server/api/auth/*-, así que no necesita ser
    // pública. Si se omite, cae a API_BASE_URL.
    authApiBase: withProtocol(process.env.AUTH_API_BASE_URL || process.env.API_BASE_URL || ''),
    authCookieDomain: process.env.AUTH_COOKIE_DOMAIN ?? '',
    authCookieSecure: process.env.AUTH_COOKIE_SECURE !== 'false',
    authCookieSameSite: (process.env.AUTH_COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? 'lax',
    authAccessTokenMaxAge: Number(process.env.AUTH_ACCESS_TOKEN_MAX_AGE ?? 60 * 15),
    authRefreshTokenMaxAge: Number(process.env.AUTH_REFRESH_TOKEN_MAX_AGE ?? 60 * 60 * 24 * 7),
    authRefreshEndpoint: process.env.AUTH_REFRESH_ENDPOINT ?? '/auth/token/refresh/',
    public: {
      apiBase: withProtocol(process.env.API_BASE_URL ?? ''),
      authGoogleEnabled: process.env.AUTH_GOOGLE_ENABLED === 'true',
      googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    },
  },
})
