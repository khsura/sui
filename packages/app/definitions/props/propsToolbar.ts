import type { ToolbarDensity } from '@khsura/sui/constants'
import {
  type PropsColor,
  type PropsTag,
  type PropsBorder,
  type PropsElevation,
  type PropsPosition,
  type PropsContent,
} from './core'

export type PropsToolbar = {
  density?: ToolbarDensity | null | undefined
  extended?: boolean | null | undefined
  extensionHeight?: number | string | undefined
  extensionStyle?: Record<string, string> | undefined
  extensionClass?: string | Record<string, boolean | undefined> | undefined
  height?: number | string | null | undefined
  title?: string | null | undefined
} & PropsTag &
  PropsColor &
  PropsBorder &
  PropsElevation &
  PropsPosition &
  PropsContent
