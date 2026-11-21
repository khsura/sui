/** Horizontal edges of a box, in viewport pixels (a subset of DOMRect). */
export interface HorizontalEdges {
  left: number
  right: number
}

/**
 * The scrollLeft that brings `item` fully into view inside a horizontal scroller, moving as little as
 * possible. Returns the current scrollLeft when the item is already visible. An item wider than the
 * scroller is aligned to its start.
 */
export const getScrollLeftToReveal = (scroller: HorizontalEdges, item: HorizontalEdges, scrollLeft: number) => {
  const scrollerWidth = scroller.right - scroller.left
  const itemWidth = item.right - item.left

  if (item.left < scroller.left || itemWidth > scrollerWidth) {
    return scrollLeft - (scroller.left - item.left)
  }

  if (item.right > scroller.right) {
    return scrollLeft + (item.right - scroller.right)
  }

  return scrollLeft
}
