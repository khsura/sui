import { type PropsBorder, type PropsColor, type PropsDisabled } from './core'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsChip = {
  label?: boolean
  closable?: boolean
  link?: boolean
} & PropsColor &
  PropsDisabled &
  PropsBorder &
  PropsSizePreset
