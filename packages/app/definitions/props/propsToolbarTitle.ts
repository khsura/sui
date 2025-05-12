import { type PropsTag, type PropsColor } from './core'

export type PropsToolbarTitle = {
  text?: string | null
} & PropsTag &
  PropsColor
