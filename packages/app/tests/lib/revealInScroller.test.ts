import { getHiddenScrollEdges, getScrollLeftToReveal } from '../../lib/revealInScroller'

const scroller = { left: 0, right: 300 }

describe('getScrollLeftToReveal', () => {
  test('keeps the scroll position when the item is already visible', () => {
    expect(getScrollLeftToReveal(scroller, { left: 100, right: 200 }, 50)).toBe(50)
  })

  test('scrolls forward just enough to show an item past the right edge', () => {
    expect(getScrollLeftToReveal(scroller, { left: 250, right: 380 }, 40)).toBe(120)
  })

  test('scrolls back to show an item before the left edge', () => {
    expect(getScrollLeftToReveal(scroller, { left: -60, right: 40 }, 200)).toBe(140)
  })

  test('aligns an item wider than the scroller to its start', () => {
    expect(getScrollLeftToReveal(scroller, { left: 120, right: 520 }, 0)).toBe(120)
  })
})

describe('getHiddenScrollEdges', () => {
  test('reports no hidden edge when the content fits', () => {
    expect(getHiddenScrollEdges({ scrollLeft: 0, scrollWidth: 300, clientWidth: 300 }, 1)).toEqual({
      start: false,
      end: false,
    })
  })

  test('reports the end as hidden at the start of an overflowing row', () => {
    expect(getHiddenScrollEdges({ scrollLeft: 0, scrollWidth: 500, clientWidth: 300 }, 1)).toEqual({
      start: false,
      end: true,
    })
  })

  test('reports both edges as hidden in the middle', () => {
    expect(getHiddenScrollEdges({ scrollLeft: 100, scrollWidth: 500, clientWidth: 300 }, 1)).toEqual({
      start: true,
      end: true,
    })
  })

  test('ignores sub-pixel rounding at the end', () => {
    expect(getHiddenScrollEdges({ scrollLeft: 199.5, scrollWidth: 500, clientWidth: 300 }, 1)).toEqual({
      start: true,
      end: false,
    })
  })
})
