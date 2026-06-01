import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/image', '@pinia/nuxt', 'shadcn-nuxt'],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL ?? '',
    },
  },
})
