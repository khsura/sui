import { type ExposedAppColorType, type PresetColorType } from '@khsura/sui/types'
import { type PropsComponentTheme } from './componentTheme'

export interface PropsColor<T extends PresetColorType | ExposedAppColorType | string = string>
  extends PropsComponentTheme {
  color?: T | undefined
  colorThreshold?: number | undefined
}
