import type { PropsDisabled } from '@khsura/sui/definitions/props/core/propsDisabled'
import type { ComponentPublicInstance } from 'vue'

export type PropsActivator = {
  activator?: string | HTMLElement | ComponentPublicInstance | null
  preventCloseOnClick?: boolean
} & PropsDisabled
