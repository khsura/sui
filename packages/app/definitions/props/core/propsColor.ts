import { type PropsComponentTheme } from './propsComponentTheme'
import { type ExposedAppColorType, type PresetColorType } from '@/app/types'

export interface PropsColor<
  T extends PresetColorType | ExposedAppColorType | string = string,
> extends PropsComponentTheme {
  color?: T | undefined
  colorThreshold?: number | undefined
}
