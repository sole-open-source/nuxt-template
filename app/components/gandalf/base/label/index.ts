import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as GLabel } from './GLabel.vue'

export const gandalfLabelVariants = cva('flex items-center gap-1.5', {
    variants: {
        disabled: {
            true: 'opacity-50 cursor-not-allowed pointer-events-none',
            false: ''
        }
    },
    defaultVariants: {
        disabled: false
    }
})

export type GandalfLabelVariants = VariantProps<typeof gandalfLabelVariants>
