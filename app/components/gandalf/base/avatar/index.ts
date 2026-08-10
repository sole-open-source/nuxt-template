import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { InjectionKey, Ref } from 'vue'

export { default as GAvatar } from './GAvatar.vue'
export { default as GAvatarImage } from './GAvatarImage.vue'
export { default as GAvatarFallback } from './GAvatarFallback.vue'

export const avatarVariantKey: InjectionKey<Ref<GandalfAvatarVariant>> = Symbol('avatar-variant')

export const gandalfAvatarVariants = cva('', {
    variants: {
        variant: {
            rounded: 'rounded-full',
            square: 'rounded-md'
        }
    },
    defaultVariants: {
        variant: 'rounded'
    }
})

export type GandalfAvatarVariants = VariantProps<typeof gandalfAvatarVariants>
export type GandalfAvatarVariant = NonNullable<GandalfAvatarVariants['variant']>
