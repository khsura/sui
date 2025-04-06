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
} & PropsBorder
