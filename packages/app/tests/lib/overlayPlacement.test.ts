import { getOverlayPlacement } from '../../lib/overlayPlacement'

const viewportWidth = 375
const viewportHeight = 800
const gutter = 8
const menuSize = { width: 140, height: 160 }

describe('getOverlayPlacement', () => {
  test('keeps an overlay that already fits where it is', () => {
    const placement = getOverlayPlacement({
      activator: { top: 100, left: 100, width: 40, height: 40 },
      content: { top: 140, left: 100, ...menuSize },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement).toEqual({ top: 140, left: 100 })
  })

  test('flips a bottom overlay above an activator at the bottom edge, keeping the gap', () => {
    const placement = getOverlayPlacement({
      activator: { top: 750, left: 8, width: 100, height: 40 },
      content: { top: 794, left: 8, ...menuSize },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement).toEqual({ top: 750 - 4 - menuSize.height, left: 8 })
  })

  test('flips a top overlay below an activator at the top edge', () => {
    const placement = getOverlayPlacement({
      activator: { top: 8, left: 8, width: 100, height: 40 },
      content: { top: 8 - menuSize.height, left: 8, ...menuSize },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement.top).toBe(48)
  })

  test('shifts instead of flipping when the other side has no room either', () => {
    const tallContent = { width: 140, height: 500 }

    const placement = getOverlayPlacement({
      activator: { top: 380, left: 8, width: 100, height: 40 },
      content: { top: 420, left: 8, ...tallContent },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement.top).toBe(viewportHeight - gutter - tallContent.height)
  })

  test('shifts an overlay left so it does not cross the right edge', () => {
    const placement = getOverlayPlacement({
      activator: { top: 100, left: 330, width: 36, height: 36 },
      content: { top: 136, left: 330, ...menuSize },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement.left).toBe(viewportWidth - gutter - menuSize.width)
  })

  test('shifts an overlay right so it does not cross the left edge', () => {
    const placement = getOverlayPlacement({
      activator: { top: 100, left: 0, width: 36, height: 36 },
      content: { top: 136, left: -50, ...menuSize },
      viewportWidth,
      viewportHeight,
      gutter,
    })

    expect(placement.left).toBe(gutter)
  })
})
