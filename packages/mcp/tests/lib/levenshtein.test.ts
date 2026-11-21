import { levenshteinDistance } from '../../src/lib'

describe('levenshteinDistance', () => {
  it.each([
    ['', '', 0],
    ['abc', '', 3],
    ['kitten', 'sitting', 3],
    ['sdialog', 'sdialg', 1],
    ['same', 'same', 0],
  ])('distance(%j, %j) is %i', (source, target, expected) => {
    expect(levenshteinDistance(source, target)).toBe(expected)
  })
})
