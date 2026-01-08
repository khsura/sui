import type { PropsContent } from './core'
import type { GridAlignPropertyType, GridJustifyPropertyType } from '@/app/types'

export type PropsRow = PropsContent & {
  noGutters?: boolean | null | undefined
  align?: GridAlignPropertyType | null | undefined
  justify?: GridJustifyPropertyType | null | undefined
  fillHeight?: boolean | null | undefined
  noOuterGutters?: boolean | null | undefined
  dense?: boolean | null | undefined
  gap?: number | string | null | undefined
}
