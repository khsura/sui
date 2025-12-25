import { type PropsMeasurableStyles } from './core'
import type { LazyLoad } from '@/app/constants'

export type PropsImage = {
  src: string | null | undefined
  alt?: string | null | undefined
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  aspectRatio?: number | null | undefined
  lazyLoad?: LazyLoad | null | undefined
} & PropsMeasurableStyles
