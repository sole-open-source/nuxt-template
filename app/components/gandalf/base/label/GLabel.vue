<script setup lang="ts">
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { gandalfLabelVariants } from './index'

const props = defineProps<
    LabelProps & {
        class?: HTMLAttributes['class']
        required?: boolean
        disabled?: boolean
    }
>()

const delegatedProps = reactiveOmit(props, 'class', 'required', 'disabled')
</script>

<template>
    <Label v-bind="delegatedProps" :class="cn(gandalfLabelVariants({ disabled }), props.class)">
        <slot />
        <span
            v-if="required"
            :class="cn('text-destructive', disabled && 'opacity-50')"
            aria-hidden="true"
            >*</span
        >
    </Label>
</template>
