import { type PropsBorder, type PropsColor, type PropsDisabled, type PropsDensity } from './core'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsChip = {
  label?: boolean
  closable?: boolean
  link?: boolean
} & PropsDensity &
  PropsColor &
  PropsDisabled &
  PropsBorder &
  PropsSizePreset
