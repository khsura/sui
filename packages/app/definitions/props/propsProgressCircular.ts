import { type PropsTextColor, type PropsComponentTheme } from './core'

export type PropsProgressCircular = PropsTextColor &
  PropsComponentTheme & {
    size?: number | string
    indeterminate?: boolean
    rotate?: number
    width?: number
    value?: number
  }
