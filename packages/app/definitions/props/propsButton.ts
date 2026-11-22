import {
  type PropsBorder,
  type PropsColor,
  type PropsDisabled,
  type PropsElevation,
  type PropsMeasurableStyles,
  type PropsTag,
  type PropsButtonVariant,
  type PropsLink,
  type PropsDensity,
} from './core'
import { type PropsSingleGroupItem } from './propsSingleGroupItem'
import { type PropsSizePreset } from './propsSizePreset'
import type { ButtonTypeType } from '@/app/types'

export type PropsButton = {
  type?: ButtonTypeType
  loading?: boolean
  block?: boolean
  rounded?: boolean
} & PropsDensity &
  PropsTag<'button' | 'a'> &
  PropsButtonVariant &
  PropsMeasurableStyles &
  PropsElevation &
  PropsColor &
  PropsSizePreset &
  PropsLink &
  PropsBorder &
  PropsDisabled &
  PropsSingleGroupItem
