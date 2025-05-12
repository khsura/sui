import { type PropsTag, type PropsBorder, type PropsMeasurableStyles, type PropsPosition } from './core'
import { type PropsLayout } from './propsLayout'
import { type PropsScrollable } from './propsScrollable'
import { type PropsSingleGroup } from './propsSingleGroup'

export type PropsBottomNavigation = {
  activeClass?: string
  hideOnScroll?: boolean
  horizontal?: boolean
  inputValue?: boolean
  shift?: boolean
  dense?: boolean
  bordered?: boolean
  grow?: boolean
} & PropsTag &
  PropsBorder &
  PropsMeasurableStyles &
  PropsLayout &
  PropsPosition &
  PropsScrollable &
  PropsSingleGroup
