<script setup lang="ts">
import type { AccordionItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { computed, inject } from 'vue'
import { AccordionItem } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { ACCORDION_VARIANT_KEY, gandalfAccordionItemVariants } from './index'

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
const variant = inject(
    ACCORDION_VARIANT_KEY,
    computed(() => 'default' as const)
)
</script>

<template>
    <AccordionItem
        v-slot="slotProps"
        v-bind="delegatedProps"
        :class="cn(gandalfAccordionItemVariants({ variant }), props.class)"
    >
        <slot v-bind="slotProps" />
    </AccordionItem>
</template>
