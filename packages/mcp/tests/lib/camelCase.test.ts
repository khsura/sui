import { toCamelCase } from '../../src/lib'

describe('toCamelCase', () => {
  it.each([
    ['extension-height', 'extensionHeight'],
    ['hide-details', 'hideDetails'],
    ['modelValue', 'modelValue'],
    ['size', 'size'],
  ])('%s → %s', (input, expected) => {
    expect(toCamelCase(input)).toBe(expected)
  })
})
