import { describe, expect, it } from 'vitest'
import { getThemeHeadScript } from '@/app/index'

describe('getThemeHeadScript', () => {
  it('reads the global sui-theme storage key', () => {
    const script = getThemeHeadScript()

    expect(script).toContain("localStorage.getItem('sui-theme')")
  })

  it('resolves auto via prefers-color-scheme and sets data-theme', () => {
    const script = getThemeHeadScript()

    expect(script).toContain('prefers-color-scheme: dark')
    expect(script).toContain("setAttribute('data-theme'")
  })

  it('is wrapped in a self-invoking try/catch IIFE', () => {
    const script = getThemeHeadScript()

    expect(script.trim().startsWith('(function()')).toBe(true)
    expect(script).toContain('try')
    expect(script).toContain('catch')
  })
})
