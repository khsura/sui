import { z } from 'zod'
import { PresetColor } from '@khsura/sui/constants'
import { getCleanSetObject } from '@khsura/sui/lib'
import { useAppProviderRepository } from './appProviderRepository'

export const useColorRepository = () => {
  const { config } = useAppProviderRepository()

  const getPresetColor = (color: string | undefined | null) => {
    if (!color) {
      return undefined
    }

    return config.themes[config.theme].presetColors[color] ? color : undefined
  }

  const getPresetColorValue = (color: string | undefined | null) => {
    if (!color) {
      return undefined
    }

    const presetColorValue = config.themes[config.theme].presetColors[color]

    return presetColorValue ? presetColorValue : color
  }

  const getIsPredefinedPresetColor = (color: string | undefined | null) => {
    return z.nativeEnum(PresetColor).safeParse(color).success
  }

  const getIsPresetColor = (color: string | undefined | null) => {
    return getPresetColor(color) !== undefined
  }

  const getBackgroundColorAttributes = (color: string | undefined | null) => {
    const isPredefinedPresetColor = getIsPredefinedPresetColor(color)

    const getStyle = () => {
      if (!color || isPredefinedPresetColor) {
        return getCleanSetObject({})
      }

      if (getIsPresetColor(color)) {
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
      class: isPredefinedPresetColor
        ? {
            [`s_backgroundColor__${color}`]: true,
          }
        : {},
      style: getStyle(),
    }
  }

  return {
    getPresetColor,
    getIsPresetColor,
    getPresetColorValue,
    getIsPredefinedPresetColor,
    getBackgroundColorAttributes,
  }
}
