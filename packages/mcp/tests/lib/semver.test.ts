import { compareVersions, isVersionAtLeast } from '../../src/lib'

describe('compareVersions', () => {
  it.each([
    ['1.20.0', '1.20.0', 0],
    ['1.19.9', '1.20.0', -1],
    ['1.20.1', '1.20.0', 1],
    ['2.0.0', '1.99.99', 1],
    ['1.9.0', '1.10.0', -1],
    ['v1.20.0', '1.20.0', 0],
    ['1.20.0+build.5', '1.20.0', 0],
    ['1.20.0-beta.1', '1.20.0', -1],
    ['1.20.0', '1.20.0-beta.1', 1],
    ['1.20.0-alpha', '1.20.0-beta', -1],
  ])('compares %s with %s', (left, right, expectedSign) => {
    expect(Math.sign(compareVersions(left, right) ?? Number.NaN)).toBe(expectedSign)
  })

  it.each([
    ['latest', '1.20.0'],
    ['1.20', '1.20.0'],
    ['1.20.0', ''],
  ])('returns undefined for a non-semver value (%s, %s)', (left, right) => {
    expect(compareVersions(left, right)).toBeUndefined()
  })
})

describe('isVersionAtLeast', () => {
  it.each([
    ['1.20.0', true],
    ['1.21.3', true],
    ['1.19.0', false],
    ['1.20.0-rc.1', false],
    ['not-a-version', false],
  ])('%s is at least 1.20.0: %s', (version, expected) => {
    expect(isVersionAtLeast(version, '1.20.0')).toBe(expected)
  })
})
