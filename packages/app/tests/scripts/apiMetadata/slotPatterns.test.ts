import { extractPatternSlots } from '../../../scripts/apiMetadata/slotPatterns'

const toSfc = (script: string) => `<template><div /></template>\n<script setup lang="ts">\n${script}\n</script>\n`

describe('extractPatternSlots', () => {
  it('turns a template-literal index signature into a named pattern slot', () => {
    const sfc = toSfc(`defineSlots<{
  /** One cell. */
  [column: \`item.\${string}\`]: ((props: { value: string }) => void) | undefined
  default?: () => void
}>()`)

    expect(extractPatternSlots(sfc)).toEqual([
      { name: 'item.<column>', type: '{ value: string }', description: 'One cell.', pattern: '^item\\..+$' },
    ])
  })

  it('handles several placeholders and escapes regex characters', () => {
    const sfc = toSfc('defineSlots<{ [part: `a+${string}.${string}`]: () => void }>()')

    expect(extractPatternSlots(sfc)).toEqual([
      { name: 'a+<part>.<part>', type: 'any', description: '', pattern: '^a\\+.+\\..+$' },
    ])
  })

  it('returns nothing without defineSlots or script setup', () => {
    expect(extractPatternSlots(toSfc('const count = 1'))).toEqual([])
    expect(extractPatternSlots('<template><div /></template>')).toEqual([])
  })
})
