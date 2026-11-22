import { getScrollLeftToReveal } from '../../lib/revealInScroller'

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
