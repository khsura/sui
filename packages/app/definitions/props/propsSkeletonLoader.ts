import { type PropsComponentTheme, type PropsMeasurableStyles } from './core'

export type PropsSkeletonLoader = {
  /**
   * What to draw: presets joined by commas, each with an optional `@N` repeat count. Presets: `text`, `heading`,
   * `avatar`, `button`, `image`, `card`, `list-item`, `list-item-avatar`, `table-row`, `table`. Example:
   * `'avatar, text@3'`. Unknown presets are ignored. Defaults to `'text'`.
   */
  type?: string | undefined
  /**
   * Shows the skeleton while `true` and the default slot once `false`. Without a default slot the skeleton is always
   * shown, so a standalone `<SSkeletonLoader type="card" />` needs no `loading`.
   */
  loading?: boolean | undefined
  /** Draws still bones, without the shimmer animation (the shimmer also stops for `prefers-reduced-motion`). */
  boilerplate?: boolean | undefined
  /** Accessible name announced while the skeleton is shown. Defaults to `'Loading…'`. */
  loadingText?: string | undefined
} & PropsComponentTheme &
  PropsMeasurableStyles
