import { type PropsColor, type PropsTag } from './core'

export type PropsList = {
  divided?: boolean
  lines?: number | null
  outlined?: boolean | null | undefined
  dense?: boolean | null | undefined
  link?: boolean | null | undefined
  inset?: boolean | null | undefined
  text?: boolean | null | undefined
} & PropsColor &
  PropsTag<'ul' | 'ol' | 'div'>
