<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { provide, toRef } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { gandalfAvatarVariants, avatarVariantKey } from './index'
import type { GandalfAvatarVariant } from './index'

const props = defineProps<{
    class?: HTMLAttributes['class']
    variant?: GandalfAvatarVariant
}>()

const delegatedProps = reactiveOmit(props, 'class', 'variant')

provide(
    avatarVariantKey,
    toRef(() => props.variant ?? 'rounded')
)
</script>

<template>
    <Avatar v-bind="delegatedProps" :class="cn(gandalfAvatarVariants({ variant }), props.class)">
        <slot />
    </Avatar>
</template>
