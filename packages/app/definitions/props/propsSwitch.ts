import type { PropsColor } from './core'
import type { PropsFormInput } from './propsFormInput'

export type PropsSwitch = PropsColor &
  PropsFormInput & {
    label?: string | null
  }
