import type { PropsColor } from './core'
import type { PropsSizePreset } from './propsSizePreset'

export type PropsAlert = {
  fixedHeight?: boolean
  minHeight?: number
  dense?: boolean
} & PropsColor &
  PropsSizePreset
