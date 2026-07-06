<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  name?: string
  imageUrl?: string
  class?: HTMLAttributes['class']
  fallbackClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <Avatar :class="cn('size-10', props.class)">
    <AvatarImage v-if="imageUrl" :src="imageUrl" :alt="name" class="object-cover" />
    <AvatarFallback :class="fallbackClass">{{ getInitials(name) }}</AvatarFallback>
  </Avatar>
</template>
