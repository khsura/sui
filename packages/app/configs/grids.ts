import { GridAlignProperty, GridJustifyProperty } from '~/constants'
import { type GridAlignPropertyType, type GridJustifyPropertyType } from '~/types'

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
