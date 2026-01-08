import type { ComponentPublicInstance } from 'vue'
import type { PropsDisabled } from './propsDisabled'

export type PropsActivator = {
  activator?: string | HTMLElement | ComponentPublicInstance | null
  preventCloseOnClick?: boolean
} & PropsDisabled
