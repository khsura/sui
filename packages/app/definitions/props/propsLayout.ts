import type { PropsLayoutProvider } from '@khsura/sui/definitions/props/propsLayoutProvider'
import { type PropsLayoutBase, type PropsMeasurableStyles } from './core'

export type PropsLayout = PropsLayoutBase & {
  for?: string | undefined
}

export type PropsLayoutContainer = PropsLayoutProvider & PropsMeasurableStyles
