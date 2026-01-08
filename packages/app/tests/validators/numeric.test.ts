import { validatorNumericCssAttribute } from '@/app/validators'

describe('validatorNumericCssAttribute', () => {
  test('should return true if the value is undefined', () => {
    expect(validatorNumericCssAttribute(undefined)).toBe(true)
  })

  test('should return true if the value is null', () => {
    expect(validatorNumericCssAttribute(null)).toBe(true)
  })

  test('should return true if the value is an empty string', () => {
    expect(validatorNumericCssAttribute('')).toBe(true)
  })

  test('should return true if the value is a number', () => {
    expect(validatorNumericCssAttribute(10)).toBe(true)
  })

  test('should return true if the value is a number', () => {
    expect(validatorNumericCssAttribute('10')).toBe(true)
  })

  test('should return true if the value is a number with a unit', () => {
    expect(validatorNumericCssAttribute('10px')).toBe(true)
  })

  test('should return false if the value is not a number', () => {
    expect(validatorNumericCssAttribute('test')).toBe(false)
  })

  test('minus numeric test should return true', () => {
    expect(validatorNumericCssAttribute('-10')).toBe(true)
  })
})
