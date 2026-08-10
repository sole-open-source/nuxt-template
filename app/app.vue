<script setup lang="ts">
import { APP_BRANDING } from '~/config/app'

// Fallback title/description: a page with its own `useHead` overrides this.
useHead({
  title: APP_BRANDING.seo.title,
  link: [{ rel: 'icon', href: APP_BRANDING.favicon }],
  meta: [
    { name: 'description', content: APP_BRANDING.seo.description },
    { property: 'og:title', content: APP_BRANDING.seo.title },
    { property: 'og:description', content: APP_BRANDING.seo.description },
  ],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Toaster />
  </div>
</template>
