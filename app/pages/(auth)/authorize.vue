<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const auth = useAuthFeature()

const code = route.query.code
if (typeof code === 'string' && code) {
  try {
    await auth.loginWithGoogle(code)
  } catch {
    await navigateTo('/login')
  }
} else {
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex justify-center py-12">
    <LoaderCircle class="size-6 animate-spin text-muted-foreground" />
  </div>
</template>
