<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  title: string
  description?: string
  class?: HTMLAttributes['class']
}>()

defineSlots<{
  icon?: () => unknown
  action?: () => unknown
}>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center',
        props.class,
      )
    "
  >
    <div
      v-if="$slots.icon"
      class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
    >
      <slot name="icon" />
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-sm font-medium">{{ title }}</p>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </div>

    <slot name="action" />
  </div>
</template>
