import { type PropsColor } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PresetColor } from '@/app/constants'

export type PropsCheckbox = {
  label?: string
  block?: boolean
  bordered?: boolean
  size?: 'default' | 'large'
} & PropsColor<PresetColor> &
  PropsFormInput
