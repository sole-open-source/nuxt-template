<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { gandalfTableHeadVariants } from './index'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableHead :class="cn(gandalfTableHeadVariants(), props.class)">
        <slot />
    </TableHead>
</template>
