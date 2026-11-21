import type { PropsPosition } from './core'

export interface PropsProgressLinear extends PropsPosition {
  backgroundColor?: string | null
  backgroundOpacity?: string | number | null
  color?: string
  size?: string | number | null
  indeterminate?: boolean
  value?: number | string
  /** Accessible name of the progress bar. Defaults to `'Loading'`; name what is loading when you can. */
  ariaLabel?: string
}
