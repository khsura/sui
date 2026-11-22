import {
  getClampedNumber,
  getDecimalCount,
  getIsNumberTextAllowed,
  getNormalizedNumber,
  getNumberText,
  getOptionalNumber,
  getParsedNumberText,
  getRoundedNumber,
} from '@/app/lib'

describe('numberInput', () => {
  test.each([
    [3, 0],
    [0.25, 2],
    [1e-7, 7],
  ])('getDecimalCount(%s) is %s', (value, count) => {
    expect(getDecimalCount(value)).toBe(count)
  })

  test('getRoundedNumber rounds to precision and keeps the value with null', () => {
    expect(getRoundedNumber(0.1 + 0.2, 2)).toBe(0.3)
    expect(getRoundedNumber(2.5, 0)).toBe(3)
    expect(getRoundedNumber(0.123, null)).toBe(0.123)
  })

  test('getClampedNumber keeps a value inside its bounds', () => {
    expect(getClampedNumber(-1, { min: 0, max: 5 })).toBe(0)
    expect(getClampedNumber(9, { min: 0, max: 5 })).toBe(5)
    expect(getClampedNumber(9, { min: null, max: null })).toBe(9)
  })

  test('getNormalizedNumber rounds, then clamps', () => {
    expect(getNormalizedNumber(4.996, { min: 0, max: 5, precision: 2 })).toBe(5)
    expect(getNormalizedNumber(7, { min: 0, max: 5, precision: 0 })).toBe(5)
  })

  test.each([
    ['', null],
    ['-', null],
    ['.', null],
    ['0', 0],
    ['-3', -3],
    ['1.', 1],
    ['.5', 0.5],
  ])('getParsedNumberText(%j) is %s', (text, value) => {
    expect(getParsedNumberText(text)).toBe(value)
  })

  test.each([
    ['12', { allowNegative: false, precision: 0 }, true],
    ['1.5', { allowNegative: false, precision: 0 }, false],
    ['-1', { allowNegative: false, precision: 0 }, false],
    ['-1', { allowNegative: true, precision: 0 }, true],
    ['1.25', { allowNegative: false, precision: 2 }, true],
    ['1.255', { allowNegative: false, precision: 2 }, false],
    ['1.2555', { allowNegative: false, precision: null }, true],
    ['1e5', { allowNegative: false, precision: null }, false],
  ])('getIsNumberTextAllowed(%j, %o) is %s', (text, options, isAllowed) => {
    expect(getIsNumberTextAllowed(text, options)).toBe(isAllowed)
  })

  test('getNumberText shows fixed decimals, or the plain number with null precision', () => {
    expect(getNumberText(5, 2)).toBe('5.00')
    expect(getNumberText(0, 0)).toBe('0')
    expect(getNumberText(1.5, null)).toBe('1.5')
    expect(getNumberText(null, 2)).toBe('')
  })

  test('getOptionalNumber reads numeric props given as strings', () => {
    expect(getOptionalNumber('0')).toBe(0)
    expect(getOptionalNumber(3)).toBe(3)
    expect(getOptionalNumber('')).toBeNull()
    expect(getOptionalNumber('abc')).toBeNull()
    expect(getOptionalNumber(undefined)).toBeNull()
  })
})
