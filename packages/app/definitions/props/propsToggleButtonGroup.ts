import { type PropsBorder, type PropsGroup, type PropsToggleButtonGroupVariant } from './core'

export type PropsToggleButtonGroup = PropsGroup &
  PropsBorder &
  PropsToggleButtonGroupVariant & {
    selectedColor?: string
    dense?: boolean
    bordered?: boolean
    shrink?: boolean
    nowrap?: boolean
  }
