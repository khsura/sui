import { GridAlignProperty, GridJustifyProperty } from '@/app/constants'
import { type GridAlignPropertyType, type GridJustifyPropertyType } from '@/app/types'

export const gridAlignProperties: GridAlignPropertyType[] = [
  GridAlignProperty.baseline,
  GridAlignProperty.center,
  GridAlignProperty.end,
  GridAlignProperty.start,
  GridAlignProperty.stretch,
]

export const gridJustifyProperties: GridJustifyPropertyType[] = [
  GridJustifyProperty.center,
  GridJustifyProperty.end,
  GridJustifyProperty.spaceAround,
  GridJustifyProperty.spaceBetween,
  GridJustifyProperty.start,
]
