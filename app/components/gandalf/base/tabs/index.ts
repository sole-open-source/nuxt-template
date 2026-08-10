import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { InjectionKey, Ref } from 'vue'

export { default as GTabs } from './GTabs.vue'
export { default as GTabsList } from './GTabsList.vue'
export { default as GTabsTrigger } from './GTabsTrigger.vue'
export { default as GTabsContent } from './GTabsContent.vue'

// Shared injection keys so GTabsTrigger can read context from GTabsList
export const tabsVariantKey: InjectionKey<Ref<GandalfTabsVariant>> = Symbol('tabs-variant')
export const tabsAlignKey: InjectionKey<Ref<GandalfTabsAlign>> = Symbol('tabs-align')

export const gandalfTabsListVariants = cva('inline-flex items-center', {
    variants: {
        variant: {
            base: 'bg-card rounded-2xl p-2 gap-1 h-14',
            outline: 'w-full bg-transparent rounded-none p-0 gap-0 border-b border-border'
        },
        align: {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            stretch: ''
        },
        fullWidth: {
            true: 'w-full',
            false: ''
        }
    },
    compoundVariants: [
        // align:stretch requires a full-width container so flex-1 triggers can fill equal space
        { align: 'stretch', class: 'w-full' }
    ],
    defaultVariants: {
        variant: 'base',
        align: 'start',
        fullWidth: false
    }
})

// Only defines what differs from the shadcn TabsTrigger base.
// The shadcn primitive already handles layout, spacing, sizing, active/disabled states,
// focus rings, and SVG utilities — do not duplicate them here.
export const gandalfTabsTriggerVariants = cva(
    // Suppress shadcn's outline-based focus indicator; the ring layer is sufficient.
    'focus-visible:outline-none',
    {
        variants: {
            variant: {
                base: 'gap-2 px-3 py-2 text-base font-semibold text-muted-foreground-quiet data-[state=active]:bg-base-loud data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary',
                // outline: override the pill style with an underline style.
                // flex-1 (from shadcn) is intentionally kept: triggers fill the container width,
                // which makes the fullWidth prop visually meaningful (compact vs full-width).
                outline:
                    'self-end rounded-none border-b-2 border-b-transparent px-3 pb-2 pt-1 text-muted-foreground -mb-px data-[state=active]:bg-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none'
            },
            align: {
                start: '',
                center: '',
                end: '',
                stretch: 'flex-1'
            }
        },
        compoundVariants: [
            // outline GTabsList is always w-full, so non-stretch alignments
            { variant: 'outline', align: 'start', class: 'flex-none' },
            { variant: 'outline', align: 'center', class: 'flex-none' },
            { variant: 'outline', align: 'end', class: 'flex-none' }
        ],
        defaultVariants: {
            variant: 'base',
            align: 'start'
        }
    }
)

export type GandalfTabsListVariants = VariantProps<typeof gandalfTabsListVariants>
export type GandalfTabsVariant = NonNullable<GandalfTabsListVariants['variant']>
export type GandalfTabsAlign = NonNullable<GandalfTabsListVariants['align']>
