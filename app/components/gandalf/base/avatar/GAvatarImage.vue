<script setup lang="ts">
import type { AvatarImageProps } from 'reka-ui'
import { AvatarImage } from '@/components/ui/avatar'

const props = defineProps<AvatarImageProps>()
</script>

<template>
    <AvatarImage v-bind="props" />
</template>
