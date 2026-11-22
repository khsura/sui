import { type PropsColor, type PropsTag, type PropsDensity } from './core'

export type PropsList = {
  divided?: boolean
  lines?: number | null
  outlined?: boolean | null | undefined
  dense?: boolean | null | undefined
  link?: boolean | null | undefined
  inset?: boolean | null | undefined
  text?: boolean | null | undefined
} & PropsDensity &
  PropsColor &
  PropsTag<'ul' | 'ol' | 'div'>
