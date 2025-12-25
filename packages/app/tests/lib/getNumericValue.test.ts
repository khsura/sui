import { getNumericValue } from '@/app/lib'

describe('getNumericValue', () => {
  test('returns a number', () => {
    const value = '123'
    const result = getNumericValue(value)

    expect(result).toBe(123)
  })

  test('returns float number if isInteger flag is disabled', () => {
    const value = '123.456'
    const result = getNumericValue(value, { allowDecimal: true })

    expect(result).toBe(123.456)
  })

  test('returns a integer number if isInteger is not provided', () => {
    const value = '123.456'
    const result = getNumericValue(value)

    expect(result).toBe(123)
  })

  test('returns a rounded default value if value is not provided', () => {
    const result = getNumericValue(undefined, { defaultValue: 100.345 })

    expect(result).toBe(100)
  })

  test('returns a default value if value is not provided', () => {
    const result = getNumericValue(undefined, { defaultValue: 100 })

    expect(result).toBe(100)
  })

  test('returns rounded value if isInteger flag is true', () => {
    const value = '123.556'
    const result = getNumericValue(value)

    expect(result).toBe(124)
  })

  test('returns null if non-numeric value is provided', () => {
    const value = 'abc'
    const result = getNumericValue(value)

    expect(result).toBeNull()
  })

  test('returns null if null value is provided', () => {
    const value = null
    const result = getNumericValue(value)

    expect(result).toBeNull()
  })

  test('returns 0 if 0 value is provided', () => {
    const value = '0'
    const result = getNumericValue(value)

    expect(result).toBe(0)
  })

  test('returns null if value is higher than max', () => {
    const value = '100'
    const result = getNumericValue(value, { max: 50 })

    expect(result).toBeNull()
  })

  test('returns null if value is lower than min', () => {
    const value = '100'
    const result = getNumericValue(value, { min: 150 })

    expect(result).toBeNull()
  })

  test('returns null if value is negative', () => {
    const value = '-100'
    const result = getNumericValue(value, { isPositive: true })

    expect(result).toBeNull()
  })

  test('returns null if value is negative and min is 0', () => {
    const value = '-100'
    const result = getNumericValue(value, { isPositive: true, min: 0 })

    expect(result).toBeNull()
  })

  test('returns null if value higher than min but isPositive flag is true', () => {
    const value = '-5'
    const result = getNumericValue(value, { isPositive: true, min: -10 })

    expect(result).toBeNull()
  })

  test('throws an error is isSafeParse is true and value is invalid', () => {
    const value = 'abc'

    expect(() => getNumericValue(value, { isStrictParse: true })).toThrowError()
  })
})
