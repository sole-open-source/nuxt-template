<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableBody } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableBody :class="cn(props.class)">
        <slot />
    </TableBody>
</template>
