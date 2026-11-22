import { type PropsBorder } from './core'

/**
 * Props for Tabs component
 * Note: modelValue is required and must be a string or number
 */
export type PropsTabs = {
  modelValue: string | number
  dense?: boolean
  bordered?: boolean
  selectedTabColor?: string
  shrink?: boolean
  /** Lay the tabs out on several rows when they do not fit, instead of one row that scrolls sideways. */
  wrap?: boolean
} & PropsBorder
