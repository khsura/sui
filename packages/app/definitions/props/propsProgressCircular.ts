import { type PropsTextColor, type PropsComponentTheme } from './core'

export type PropsProgressCircular = PropsTextColor &
  PropsComponentTheme & {
    size?: number | string
    indeterminate?: boolean
    rotate?: number
    width?: number
    value?: number
    /** Accessible name of the progress bar. Defaults to `'Loading'`; name what is loading when you can. */
    ariaLabel?: string
  }
