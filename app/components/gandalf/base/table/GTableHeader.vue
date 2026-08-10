<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableHeader } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { gandalfTableHeaderVariants } from './index'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableHeader :class="cn(gandalfTableHeaderVariants(), props.class)">
        <slot />
    </TableHeader>
</template>
