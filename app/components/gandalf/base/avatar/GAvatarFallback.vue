<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { avatarVariantKey } from './index'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const variant = inject(avatarVariantKey)
</script>

<template>
    <AvatarFallback
        v-bind="delegatedProps"
        :class="cn(variant === 'square' ? 'rounded-md' : '', props.class)"
    >
        <slot />
    </AvatarFallback>
</template>
