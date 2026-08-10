<script setup lang="ts">
import type { TabsListProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { provide, toRef } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsList } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { gandalfTabsListVariants, tabsVariantKey, tabsAlignKey } from './index'
import type { GandalfTabsVariant, GandalfTabsAlign } from './index'

const props = defineProps<
    TabsListProps & {
        class?: HTMLAttributes['class']
        variant?: GandalfTabsVariant
        align?: GandalfTabsAlign
        fullWidth?: boolean
    }
>()

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'align', 'fullWidth')

provide(
    tabsVariantKey,
    toRef(() => props.variant ?? 'base')
)
provide(
    tabsAlignKey,
    toRef(() => props.align ?? 'start')
)
</script>

<template>
    <TabsList
        v-bind="delegatedProps"
        :class="cn(gandalfTabsListVariants({ variant, align, fullWidth }), props.class)"
    >
        <slot />
    </TabsList>
</template>
