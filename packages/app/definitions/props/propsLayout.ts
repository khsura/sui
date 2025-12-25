import type { PropsLayoutProvider } from './propsLayoutProvider'
import { type PropsLayoutBase, type PropsMeasurableStyles } from './core'

export type PropsLayout = PropsLayoutBase & {
  for?: string | undefined
}

export type PropsLayoutContainer = PropsLayoutProvider & PropsMeasurableStyles
