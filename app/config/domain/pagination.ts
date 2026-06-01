export const PAGE_SIZES = [10, 25, 50] as const

export type PageSize = (typeof PAGE_SIZES)[number]

export const DEFAULT_PAGE_SIZE: PageSize = 25
