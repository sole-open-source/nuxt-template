<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TableFooter } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <TableFooter :class="cn(props.class)">
        <slot />
    </TableFooter>
</template>
