import {
  type PropsActivator,
  type PropsContent,
  type PropsLocation,
  type PropsDisabled,
  type PropsPosition,
  type PropsMeasurableStyles,
} from './core'

export type PropsMenu = {
  closeOnContentClick?: boolean
  closeOnScroll?: boolean
  offsetX?: number | null
  offsetY?: number | null
  screenPadding?: number | null
  closeOnClick?: boolean
} & PropsPosition &
  PropsLocation &
  PropsContent &
  PropsActivator &
  PropsDisabled &
  PropsMeasurableStyles
