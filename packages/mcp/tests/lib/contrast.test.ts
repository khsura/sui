import { getHexContrastRatio, parseHexColor } from '../../src/lib'

describe('parseHexColor', () => {
  it.each([
    ['#ffffff', [255, 255, 255]],
    ['#FFF', [255, 255, 255]],
    ['#424242', [66, 66, 66]],
    [' #1976d2 ', [25, 118, 210]],
  ])('parses %s', (color, expected) => {
    expect(parseHexColor(color)).toEqual(expected)
  })

  it.each(['navy', 'rgb(0, 0, 0)', '#12345', '#ggg', ''])('returns undefined for %s', (color) => {
    expect(parseHexColor(color)).toBeUndefined()
  })
})

describe('getHexContrastRatio', () => {
  it('gives 21:1 for black on white', () => {
    expect(getHexContrastRatio('#000', '#fff')).toBeCloseTo(21)
  })

  it('gives 1:1 for the same colour', () => {
    expect(getHexContrastRatio('#424242', '#424242')).toBeCloseTo(1)
  })

  it('measures the darkened warning text on the snackbar at 1.85:1', () => {
    expect(getHexContrastRatio('#706a52', '#424242')).toBeCloseTo(1.85, 2)
  })

  it('returns undefined when a colour is not hex', () => {
    expect(getHexContrastRatio('navy', '#424242')).toBeUndefined()
  })
})
