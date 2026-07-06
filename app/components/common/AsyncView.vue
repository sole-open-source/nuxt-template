<script setup lang="ts">
import { AlertCircle, LoaderCircle } from '@lucide/vue'
import type { AsyncViewState } from '~/types/ui/view-state'

defineProps<{
  viewState: AsyncViewState
  error?: string | null
}>()
</script>

<template>
  <div v-if="viewState === 'loading'" class="flex flex-1 items-center justify-center py-12">
    <slot name="loading">
      <LoaderCircle class="size-6 animate-spin text-muted-foreground" />
    </slot>
  </div>

  <div
    v-else-if="viewState === 'error'"
    class="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center"
  >
    <slot name="error" :message="error ?? null">
      <AlertCircle class="size-8 text-destructive" />
      <p class="text-sm font-medium text-destructive">Ocurrió un error</p>
      <p v-if="error" class="text-sm text-muted-foreground">{{ error }}</p>
    </slot>
  </div>

  <div v-else-if="viewState === 'empty'" class="flex flex-1 items-center justify-center py-12">
    <slot name="empty">
      <p class="text-sm text-muted-foreground">No se encontraron resultados.</p>
    </slot>
  </div>

  <slot v-else />
</template>
