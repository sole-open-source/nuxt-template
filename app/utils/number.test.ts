import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatNumber } from './number'

describe('formatCurrency', () => {
  it('formatea en COP por defecto', () => {
    expect(formatCurrency(1000)).toMatch(/1[.,]000/)
  })

  it('acepta currency alternativo', () => {
    expect(formatCurrency(1000, { currency: 'USD' })).toMatch(/1[.,]000/)
  })

  it('acepta string como valor', () => {
    expect(formatCurrency('2500')).toMatch(/2[.,]500/)
  })
})

describe('formatPercent', () => {
  it('formatea porcentaje correctamente', () => {
    expect(formatPercent(75.5)).toContain('75')
    expect(formatPercent(75.5)).toContain('%')
  })
})

describe('formatNumber', () => {
  it('formatea número con separadores', () => {
    expect(formatNumber(1000000)).toMatch(/1[.,]000[.,]000/)
  })
})
