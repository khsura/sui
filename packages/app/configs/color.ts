import { ExposedAppColor, PresetColor } from '@sui/app/constants/color'
import { type PresetColorType, type ExposedAppColorType } from '@sui/app/types'

export const presetColors: Array<PresetColorType | ExposedAppColorType> = [
  PresetColor.primary,
  PresetColor.secondary,
  PresetColor.info,
  PresetColor.error,
  PresetColor.success,
  PresetColor.warning,
  PresetColor.important,
  ExposedAppColor.background,
  ExposedAppColor.card,
]
