import { presetColors } from '@sui/app/configs/color'
import { type AppState, type ExposedAppColorType, type PresetColorType } from '@sui/app/types'

export const getBackgroundColorAttributes = (config: AppState, color: string | null) => {
  const isPresetColor = getIsPresetColor(color)

  const isCustomPresetColor = !isPresetColor && !!color && !!config.themes[config.theme].presetColors[color]

  const getStyle = ():
    | { backgroundColor: string; color: string }
    | { backgroundColor: string }
    | Record<string, never> => {
    if (isPresetColor || !color) {
      return {}
    }

    if (isCustomPresetColor) {
      return {
        backgroundColor: `var(--s-color-${color})`,
        color: `var(--s-color-${color}--text)`,
      }
    }

    return {
      backgroundColor: color,
    }
  }

  return {
    class: isPresetColor
      ? {
          [`s_backgroundColor__${color}`]: true,
        }
      : {},
    style: getStyle(),
  }
}

export const getIsPresetColor = (color: string | undefined | null) => {
  return color !== null && color !== undefined && presetColors.includes(color as PresetColorType | ExposedAppColorType)
}
