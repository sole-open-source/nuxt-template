<script setup lang="ts">
import type { AccordionTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import { AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import {
    gandalfAccordionIndicatorVariants,
    type GandalfAccordionIndicatorColor,
    type GandalfAccordionIndicatorPosition
} from './index'

const props = withDefaults(
    defineProps<
        AccordionTriggerProps & {
            class?: HTMLAttributes['class']
            indicatorColor?: GandalfAccordionIndicatorColor
            indicatorPosition?: GandalfAccordionIndicatorPosition
        }
    >(),
    {
        class: undefined,
        indicatorColor: 'default',
        indicatorPosition: 'end'
    }
)

const delegatedProps = reactiveOmit(props, 'class', 'indicatorColor', 'indicatorPosition')
</script>

<template>
    <AccordionTrigger
        v-bind="delegatedProps"
        :class="
            cn(
                'group h-12 items-center px-4 py-0',
                indicatorPosition === 'start' && 'flex-row-reverse',
                props.class
            )
        "
    >
        <slot />
        <template #icon>
            <slot name="icon">
                <span :class="gandalfAccordionIndicatorVariants({ color: indicatorColor })">
                    <slot name="indicator-label" />
                    <ChevronDown
                        class="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                </span>
            </slot>
        </template>
    </AccordionTrigger>
</template>
