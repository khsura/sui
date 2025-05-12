import {
  type PropsColor,
  type PropsMeasurableStyles,
  type PropsElevation,
  type PropsPosition,
  type PropsTag,
} from './core'
import type { PropsLayout } from './propsLayout'

export type PropsFooter = PropsLayout &
  PropsTag<'div' | 'footer'> &
  PropsColor &
  PropsMeasurableStyles &
  PropsElevation &
  PropsPosition & {
    inset?: boolean
    padless?: boolean
  }
