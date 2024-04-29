import { type PropsContent } from './core'

export type GridAlignPropertyType = 'baseline' | 'center' | 'end' | 'start' | 'stretch'
export type GridJustifyPropertyType = 'center' | 'end' | 'spaceAround' | 'spaceBetween' | 'start'

export interface PropsRow extends PropsContent {
  noGutters?: boolean | null | undefined
  align?: GridAlignPropertyType | null | undefined
  justify?: GridJustifyPropertyType | null | undefined
  fillHeight?: boolean | null | undefined
  noOuterGutters?: boolean | null | undefined
  dense?: boolean | null | undefined
  gap?: number | string | null | undefined
}
