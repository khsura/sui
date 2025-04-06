import { type PresetColor } from '@khsura/sui/constants'
import { type PropsColor } from './core'
import { type PropsFormInput } from './propsFormInput'

export type PropsCheckbox = {
  label?: string
  block?: boolean
  bordered?: boolean
  size?: 'default' | 'large'
} & PropsColor<PresetColor> &
  PropsFormInput
