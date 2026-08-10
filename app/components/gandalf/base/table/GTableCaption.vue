<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableCaption } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableCaption :class="cn(props.class)">
        <slot />
    </TableCaption>
</template>
