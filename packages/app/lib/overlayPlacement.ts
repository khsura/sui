import type { OverlayPlacementInput } from '@/app/types'

/**
 * Keeps an overlay inside the viewport, `gutter` pixels from every edge.
 *
 * Vertically it first flips to the other side of the activator (keeping the same gap) when that side has room,
 * otherwise it shifts the overlay until it fits. Horizontally it shifts. All values are viewport coordinates.
 */
export const getOverlayPlacement = ({
  content,
  activator,
  viewportWidth,
  viewportHeight,
  gutter,
}: OverlayPlacementInput) => {
  const activatorBottom = activator.top + activator.height
  const contentBottom = content.top + content.height
  const maxBottom = viewportHeight - gutter
  const isBelowActivator = content.top >= activatorBottom
  const isAboveActivator = contentBottom <= activator.top
  let top = content.top

  if (contentBottom > maxBottom) {
    const flippedTop = activator.top - (content.top - activatorBottom) - content.height

    top = isBelowActivator && flippedTop >= gutter ? flippedTop : maxBottom - content.height
  } else if (content.top < gutter) {
    const flippedTop = activatorBottom + (activator.top - contentBottom)

    top = isAboveActivator && flippedTop + content.height <= maxBottom ? flippedTop : gutter
  }

  const maxLeft = viewportWidth - gutter - content.width

  return {
    top: Math.max(gutter, top),
    left: Math.max(gutter, Math.min(content.left, maxLeft)),
  }
}
