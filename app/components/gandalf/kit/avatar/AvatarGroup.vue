<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <div
        :class="
            cn(
                'flex -space-x-2',
                // '*:data-[slot=avatar]:ring-2',
                // '*:data-[slot=avatar]:ring-background',
                props.class
            )
        "
    >
        <slot />
    </div>
</template>
