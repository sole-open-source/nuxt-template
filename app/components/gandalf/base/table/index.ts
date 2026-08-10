import { cva } from 'class-variance-authority'

export { default as GTable } from './GTable.vue'
export { default as GTableHeader } from './GTableHeader.vue'
export { default as GTableBody } from './GTableBody.vue'
export { default as GTableFooter } from './GTableFooter.vue'
export { default as GTableRow } from './GTableRow.vue'
export { default as GTableHead } from './GTableHead.vue'
export { default as GTableCell } from './GTableCell.vue'
export { default as GTableCaption } from './GTableCaption.vue'

export const gandalfTableVariants = cva('rounded-lg border border-slate-200 overflow-hidden')

export const gandalfTableHeaderVariants = cva('bg-base-loud')

export const gandalfTableRowVariants = cva('border-slate-200')

export const gandalfTableHeadVariants = cva(
    'h-11 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-base-foreground-extra-quiet'
)

export const gandalfTableCellVariants = cva('h-10 px-3 py-1.5 text-sm text-base-foreground-loud')
