import { type PropsLayout } from './propsLayout'
import { type PropsPosition } from './core'
import { type PropsScrollable } from './propsScrollable'
import { type PropsToolbar } from './propsToolbar'

export type PropsAppBar = {
  elevateOnScroll?: boolean
  hideOnScroll?: boolean
  fixedExtension?: boolean
} & PropsToolbar &
  PropsLayout &
  PropsScrollable &
  PropsPosition
