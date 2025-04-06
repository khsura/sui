import {
  type PropsBorder,
  type PropsColor,
  type PropsDisabled,
  type PropsElevation,
  type PropsMeasurableStyles,
  type PropsTag,
  type PropsButtonVariant,
  type PropsLink,
} from './core'
import { type PropsSingleGroupItem } from './propsSingleGroupItem'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsButton = {
  type?: 'button' | 'reset' | 'submit'
  loading?: boolean
  block?: boolean
  rounded?: boolean
} & PropsTag<'button' | 'a'> &
  PropsButtonVariant &
  PropsMeasurableStyles &
  PropsElevation &
  PropsColor &
  PropsSizePreset &
  PropsLink &
  PropsBorder &
  PropsDisabled &
  PropsSingleGroupItem
