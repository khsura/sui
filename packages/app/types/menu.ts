import { type CSSProperties } from 'vue'

export interface MenuContentStyle extends CSSProperties {
  top?: string
  left?: string
  minWidth?: string
}

/** A box in viewport coordinates (pixels from the top-left corner of the visible area). */
export interface OverlayBox {
  top: number
  left: number
  width: number
  height: number
}

export interface OverlayPlacementInput {
  /** The overlay where its location prop put it. */
  content: OverlayBox
  /** The activator the overlay belongs to. */
  activator: OverlayBox
  viewportWidth: number
  viewportHeight: number
  /** Distance to keep from every viewport edge. */
  gutter: number
}

export interface EmitMenu {
  (event: 'close'): void
}
