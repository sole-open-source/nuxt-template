<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { gandalfTableRowVariants } from './index'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableRow :class="cn(gandalfTableRowVariants(), props.class)">
        <slot />
    </TableRow>
</template>
