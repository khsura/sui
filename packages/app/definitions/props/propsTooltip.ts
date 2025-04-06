import { type PropsColor, type PropsMeasurableStyles } from './core'
import { type PropsMenu } from './propsMenu'

/**
 * Props for Tooltip component
 * Note: Menu location defaults to 'bottom'
 */
export type PropsTooltip = {
  opacity?: number | string
} & PropsMeasurableStyles &
  PropsMenu &
  PropsColor
