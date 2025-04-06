import { type PropsTag } from './core'

export type PropsStepperStep = {
  step: number
  editable?: boolean
  disabled?: boolean
} & PropsTag
