import {
  type PropsActivator,
  type PropsElevation,
  type PropsLocation,
  type PropsMeasurableStyles,
  type PropsDisabled,
} from './core'

export type PropsDialog = {
  persistent?: boolean
  scrollable?: boolean
  fullscreen?: boolean
  borderless?: boolean
  scrollableBackground?: boolean
  closeOnClick?: boolean
} & PropsLocation &
  PropsMeasurableStyles &
  PropsActivator &
  PropsElevation &
  PropsDisabled
