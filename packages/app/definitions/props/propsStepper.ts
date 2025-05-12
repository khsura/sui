import { type PropsTag } from './core'

export type PropsStepper = {
  shrink?: boolean
  modelValue?: number
  items?: Array<{ editable?: boolean; step: number; text?: string }>
} & PropsTag
