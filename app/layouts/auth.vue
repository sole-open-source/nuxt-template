<script setup lang="ts">
import { APP_BRANDING } from '~/config/app'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <NuxtLink to="/" class="flex items-center gap-2 font-medium">
          <div
            class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <img :src="APP_BRANDING.logo" alt="" class="size-4" />
          </div>
          {{ APP_BRANDING.name }}
        </NuxtLink>
      </div>

      <div id="main-content" class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <slot />
        </div>
      </div>
    </div>

    <!-- Replace with a hero image, illustration, or brand pattern -->
    <div class="relative hidden items-center justify-center bg-muted lg:flex" aria-hidden="true" />
  </div>
</template>
