<script setup lang="ts" generic="T">
import type { Query } from '~/composables/useQuery'
import type { AppError } from '~/core/errors'
import { CircleAlertIcon, LoaderCircleIcon } from '@lucide/vue'

const props = defineProps<{ query: Query<T> }>()

defineSlots<{
  default: (props: { data: T }) => unknown
  loading?: () => unknown
  empty?: () => unknown
  error?: (props: { error: AppError }) => unknown
}>()

// A list that came back with nothing is the only "empty" this knows about —
// no isEmpty prop to configure. Anything else belongs inside the default slot.
const isEmpty = computed(() => Array.isArray(props.query.data) && props.query.data.length === 0)
</script>

<template>
  <slot v-if="query.isLoading" name="loading">
    <div class="flex flex-1 items-center justify-center py-12">
      <LoaderCircleIcon class="size-6 animate-spin text-muted-foreground" />
    </div>
  </slot>

  <slot v-else-if="query.error" name="error" :error="query.error">
    <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
      <CircleAlertIcon class="size-8 text-destructive" />
      <p class="text-sm font-medium text-destructive">Something went wrong</p>
      <p class="text-sm text-muted-foreground">{{ query.error.message }}</p>
    </div>
  </slot>

  <slot v-else-if="isEmpty" name="empty">
    <div class="flex flex-1 items-center justify-center py-12">
      <p class="text-sm text-muted-foreground">No results found.</p>
    </div>
  </slot>

  <slot v-else-if="query.data !== null" :data="query.data!" />
</template>
