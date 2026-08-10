import type { VariantProps } from 'class-variance-authority'
import type { ComputedRef, InjectionKey } from 'vue'
import { cva } from 'class-variance-authority'

export { default as GAccordion } from './GAccordion.vue'
export { default as GAccordionItem } from './GAccordionItem.vue'
export { default as GAccordionTrigger } from './GAccordionTrigger.vue'
export { default as GAccordionContent } from './GAccordionContent.vue'

export const gandalfAccordionVariants = cva('w-full', {
    variants: {
        variant: {
            default: '',
            layout: 'flex flex-col gap-3 rounded-xl',
            blended: '',
            'blended-main': ''
        }
    },
    defaultVariants: {
        variant: 'default'
    }
})

export const gandalfAccordionItemVariants = cva('', {
    variants: {
        variant: {
            default: 'border-b last:border-b-0 ',
            layout: ' bg-white border-0 rounded-xl',
            blended:
                'border-bni-border-loud bg-base-loud border-b px-4 last:border-b-0 data-[state=open]:border-bni-border-extra-loud',
            'blended-main':
                'rounded-xl overflow-hidden border border-transparent bg-white data-[state=open]:border-bni-border-extra-loud'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
})

export type GandalfAccordionVariant = NonNullable<
    VariantProps<typeof gandalfAccordionVariants>['variant']
>

export const ACCORDION_VARIANT_KEY: InjectionKey<ComputedRef<GandalfAccordionVariant>> =
    Symbol('accordion-variant')

// Color is set via currentColor, so it covers both the chevron and the `indicator-label` slot content.
export const gandalfAccordionIndicatorVariants = cva(
    'pointer-events-none inline-flex shrink-0 translate-y-0.5 items-center gap-1.5',
    {
        variants: {
            color: {
                default: 'text-muted-foreground',
                action: 'text-action'
            }
        },
        defaultVariants: {
            color: 'default'
        }
    }
)

export type GandalfAccordionIndicatorVariants = VariantProps<
    typeof gandalfAccordionIndicatorVariants
>
export type GandalfAccordionIndicatorColor = NonNullable<GandalfAccordionIndicatorVariants['color']>
export type GandalfAccordionIndicatorPosition = 'start' | 'end'
