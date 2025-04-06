import type { LazyLoad } from '@khsura/sui/constants'
import { type PropsMeasurableStyles } from './core'

export type PropsImage = {
  src: string | null | undefined
  alt?: string | null | undefined
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  aspectRatio?: number | null | undefined
  lazyLoad?: LazyLoad | null | undefined
} & PropsMeasurableStyles
