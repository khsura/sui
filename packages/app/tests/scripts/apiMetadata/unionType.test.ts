import { describe, expect, it } from 'vitest'
import { normalizeUnionType } from '../../../scripts/apiMetadata'

describe('normalizeUnionType', () => {
  it('gives the same order whichever order the checker printed', () => {
    expect(normalizeUnionType('boolean | "left" | "right" | undefined')).toBe('boolean | "left" | "right" | undefined')
    expect(normalizeUnionType('"right" | "left" | boolean | undefined')).toBe('boolean | "left" | "right" | undefined')
  })

  it('puts primitives first and null / undefined last', () => {
    expect(normalizeUnionType('undefined | null | Item | string | number')).toBe(
      'number | string | Item | null | undefined',
    )
  })

  it('leaves unions inside brackets, generics, functions and strings alone', () => {
    expect(normalizeUnionType('((value: "b" | "a") => void) | undefined')).toBe(
      '((value: "b" | "a") => void) | undefined',
    )
    expect(normalizeUnionType('Record<string, "b" | "a"> | string')).toBe('string | Record<string, "b" | "a">')
    expect(normalizeUnionType('"x | y" | boolean')).toBe('boolean | "x | y"')
  })

  it('returns a non-union type unchanged', () => {
    expect(normalizeUnionType('string')).toBe('string')
  })
})
