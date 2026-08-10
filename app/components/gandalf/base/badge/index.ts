import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'
import { cva } from 'class-variance-authority'

export { default as GBadge } from './GBadge.vue'

const colors = {
    default: { text: 'text-default', bg: 'bg-default-muted', border: 'border-default' },
    action: { text: 'text-action', bg: 'bg-action-muted', border: 'border-action' },
    information: {
        text: 'text-information',
        bg: 'bg-information-muted',
        border: 'border-information'
    },
    success: { text: 'text-success', bg: 'bg-success-muted', border: 'border-success' },
    warning: { text: 'text-warning', bg: 'bg-warning-muted', border: 'border-warning' },
    destructive: {
        text: 'text-destructive',
        bg: 'bg-destructive-muted',
        border: 'border-destructive'
    }
} as const

export type GandalfBadgeColor = keyof typeof colors | (string & {})

export const gandalfBadgeVariants = cva(
    'transition-all duration-200 hover:opacity-80 active:opacity-100',
    {
        variants: {
            variant: {
                default: 'border-transparent',
                outline: ''
            },
            shape: {
                rounded: 'rounded-full',
                square: 'rounded-sm'
            },
            size: {
                sm: '',
                default: '',
                lg: '',
                icon: 'size-6 p-0'
            }
        },
        defaultVariants: {
            variant: 'default',
            shape: 'rounded',
            size: 'default'
        }
    }
)

export type GandalfBadgeVariants = VariantProps<typeof gandalfBadgeVariants>
export type GandalfBadgeVariant = NonNullable<GandalfBadgeVariants['variant']>
export type GandalfBadgeShape = NonNullable<GandalfBadgeVariants['shape']>
export type GandalfBadgeSize = NonNullable<GandalfBadgeVariants['size']>

function isSemanticColor(color: GandalfBadgeColor): color is keyof typeof colors {
    return color in colors
}

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

export function isHexColor(color: string): boolean {
    return HEX_COLOR_REGEX.test(color)
}

function expandHex(hex: string): string {
    const short = hex.slice(1)
    return short.length === 3 || short.length === 4
        ? short
              .split('')
              .map((c) => c + c)
              .join('')
        : short
}

function hexToRgb(hex: string): [number, number, number] {
    const full = expandHex(hex)
    return [
        Number.parseInt(full.slice(0, 2), 16),
        Number.parseInt(full.slice(2, 4), 16),
        Number.parseInt(full.slice(4, 6), 16)
    ]
}

function rgbToHueAndSaturation(
    r: number,
    g: number,
    b: number
): { hue: number; saturation: number } {
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255
    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    const delta = max - min
    const l = (max + min) / 2

    if (delta === 0) return { hue: 0, saturation: 0 }

    const saturation = delta / (1 - Math.abs(2 * l - 1))

    let hue: number
    if (max === rNorm) hue = ((gNorm - bNorm) / delta) % 6
    else if (max === gNorm) hue = (bNorm - rNorm) / delta + 2
    else hue = (rNorm - gNorm) / delta + 4

    hue *= 60
    if (hue < 0) hue += 360

    return { hue, saturation: saturation * 100 }
}

// Fixed saturation/lightness so any custom hex badge shares the same visual
// weight as the semantic colors — only the hue (the color itself) changes.
const CUSTOM_BOLD_SATURATION = 72
const CUSTOM_BOLD_LIGHTNESS = 42
const CUSTOM_MUTED_SATURATION = 85
const CUSTOM_MUTED_LIGHTNESS = 93
const ACHROMATIC_SATURATION_THRESHOLD = 8

export function gandalfBadgeColorClass(
    variant: GandalfBadgeVariant = 'default',
    color: GandalfBadgeColor = 'default'
): string {
    if (!isSemanticColor(color)) return ''

    const c = colors[color]
    return variant === 'default' ? `${c.bg} ${c.text}` : `${c.border} ${c.text} ${c.bg}`
}

export function gandalfBadgeColorStyle(
    variant: GandalfBadgeVariant = 'default',
    color: GandalfBadgeColor = 'default'
): HTMLAttributes['style'] | undefined {
    if (isSemanticColor(color) || !isHexColor(color)) return undefined

    const { hue, saturation } = rgbToHueAndSaturation(...hexToRgb(color))
    const isAchromatic = saturation < ACHROMATIC_SATURATION_THRESHOLD

    const boldSaturation = isAchromatic ? 0 : CUSTOM_BOLD_SATURATION
    const mutedSaturation = isAchromatic ? 0 : CUSTOM_MUTED_SATURATION
    const bold = `hsl(${hue}, ${boldSaturation}%, ${CUSTOM_BOLD_LIGHTNESS}%)`
    const muted = `hsl(${hue}, ${mutedSaturation}%, ${CUSTOM_MUTED_LIGHTNESS}%)`

    return variant === 'outline'
        ? { color: bold, borderColor: bold, backgroundColor: muted }
        : { color: bold, backgroundColor: muted }
}
