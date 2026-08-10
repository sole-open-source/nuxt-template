<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const heading = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Page not found'
    case 403:
      return 'Access denied'
    case 401:
      return 'Authentication required'
    default:
      return 'Something went wrong'
  }
})
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
    <p class="text-6xl font-bold text-muted-foreground">{{ error.statusCode }}</p>
    <h1 class="text-2xl font-semibold">{{ heading }}</h1>
    <p class="max-w-sm text-muted-foreground">
      {{
        error.statusMessage || error.message || 'An unexpected error occurred. Please try again.'
      }}
    </p>
    <!-- `clearError` does the navigating: leaving the error in place would render this page again. -->
    <NuxtLink
      to="/"
      class="underline underline-offset-4 hover:text-primary"
      @click.prevent="clearError({ redirect: '/' })"
    >
      Go home
    </NuxtLink>
  </div>
</template>
