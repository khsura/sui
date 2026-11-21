import { colorThreshold } from '@/app/constants'
import { getContrastRatio, getReadableTextColor, getRelativeLuminance, isDarkColor } from '@/app/lib'

const contrastPrecision = 2

describe('getRelativeLuminance', () => {
  test('is 0 for black and 1 for white', () => {
    expect(getRelativeLuminance('#000000')).toBe(0)
    expect(getRelativeLuminance('#ffffff')).toBe(1)
  })

  test('expands shorthand hex', () => {
    expect(getRelativeLuminance('#fff')).toBe(1)
  })

  test('accepts CSS colour names and rgb arrays', () => {
    expect(getRelativeLuminance('white')).toBe(1)
    expect(getRelativeLuminance([0, 0, 0])).toBe(0)
  })

  test('returns null for an unparsable colour', () => {
    expect(getRelativeLuminance('not-a-colour')).toBeNull()
  })
})

describe('getContrastRatio', () => {
  test('is 21 for black on white and 1 for a colour on itself', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, contrastPrecision)
    expect(getContrastRatio('#4caf50', '#4caf50')).toBeCloseTo(1, contrastPrecision)
  })

  test('does not depend on the argument order', () => {
    expect(getContrastRatio('#ffffff', '#0071eb')).toBe(getContrastRatio('#0071eb', '#ffffff'))
  })

  test('matches the WCAG reference value for white on the former success green', () => {
    expect(getContrastRatio('#ffffff', '#4caf50')).toBeCloseTo(2.78, contrastPrecision)
  })

  test('returns null when a colour cannot be parsed', () => {
    expect(getContrastRatio('#ffffff', 'nope')).toBeNull()
  })
})

describe('getReadableTextColor', () => {
  test('picks dark text on a mid green that white text fails on', () => {
    expect(getReadableTextColor('#4caf50', '#fdfdfd', '#333333')).toBe('#333333')
  })

  test('picks light text on a dark blue', () => {
    expect(getReadableTextColor('#134ff3', '#fdfdfd', '#333333')).toBe('#fdfdfd')
  })

  test('picks dark text on a pale yellow', () => {
    expect(getReadableTextColor('#ffeb99', '#fdfdfd', '#333333')).toBe('#333333')
  })
})

describe('isDarkColor', () => {
  test('returns null for an empty or unparsable colour', () => {
    expect(isDarkColor(null)).toBeNull()
    expect(isDarkColor('')).toBeNull()
    expect(isDarkColor('nope')).toBeNull()
  })

  test('uses WCAG contrast by default: mid green needs dark text', () => {
    expect(isDarkColor('#4caf50')).toBe(false)
  })

  test('uses WCAG contrast by default: black, navy and the theme primary need light text', () => {
    expect(isDarkColor('#000000')).toBe(true)
    expect(isDarkColor('navy')).toBe(true)
    expect(isDarkColor('#0071eb')).toBe(true)
  })

  test('uses WCAG contrast by default: white and yellow need dark text', () => {
    expect(isDarkColor('#ffffff')).toBe(false)
    expect(isDarkColor('yellow')).toBe(false)
  })

  test('keeps the legacy YIQ rule when a threshold is passed', () => {
    // YIQ brightness of #4caf50 is 135, below 55% of 255 (140), so the legacy rule calls it dark
    expect(isDarkColor('#4caf50', colorThreshold)).toBe(true)
    expect(isDarkColor('#4caf50', 50)).toBe(false)
  })
})
