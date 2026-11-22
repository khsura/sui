import {
  type PropsColor,
  type PropsTag,
  type PropsBorder,
  type PropsElevation,
  type PropsPosition,
  type PropsContent,
  type PropsDensity,
} from './core'

export type PropsToolbar = {
  extended?: boolean | null | undefined
  extensionHeight?: number | string | undefined
  extensionStyle?: Record<string, string> | undefined
  extensionClass?: string | Record<string, boolean | undefined> | undefined
  height?: number | string | null | undefined
  title?: string | null | undefined
} & PropsDensity &
  PropsTag &
  PropsColor &
  PropsBorder &
  PropsElevation &
  PropsPosition &
  PropsContent
