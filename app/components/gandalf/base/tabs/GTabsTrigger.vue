<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { gandalfTabsTriggerVariants, tabsVariantKey, tabsAlignKey } from './index'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const variant = inject(tabsVariantKey)
const align = inject(tabsAlignKey)
</script>

<template>
    <TabsTrigger
        v-bind="delegatedProps"
        :class="cn(gandalfTabsTriggerVariants({ variant, align }), props.class)"
    >
        <slot />
    </TabsTrigger>
</template>
