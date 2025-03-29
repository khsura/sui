import { z } from 'zod'
import { PresetColor } from '~/constants'
import { getCleanSetObject } from '~/lib'
import { useAppProviderRepository } from './appProviderRepository'

export const useColorRepository = () => {
  const { config } = useAppProviderRepository()

  const getTheme = () => {
    return config.themes[config.theme]
  }

  const getAppColor = (color: string | undefined | null) => {
    if (!color) {
      return undefined
    }

    return getTheme().appColors[color] ? color : undefined
  }

  const getPresetColor = (color: string | undefined | null) => {
    if (!color) {
      return undefined
    }

    return getTheme().presetColors[color] ? color : undefined
  }

  const getPresetColorValue = (color: string | undefined | null) => {
    if (!color) {
      return undefined
    }

    const presetColorValue = getTheme().presetColors[color]

    return presetColorValue ? presetColorValue : color
  }

  const getIsPredefinedPresetColor = (color: string | undefined | null) => {
    return z.nativeEnum(PresetColor).safeParse(color).success
  }

  const getIsPresetColor = (color: string | undefined | null) => {
    return getPresetColor(color) !== undefined
  }

  const getIsAppColor = (color: string | undefined | null) => {
    return getAppColor(color) !== undefined
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

      if (getIsAppColor(color)) {
        return {
          backgroundColor: `var(--s-app-color-${color})`,
          color: `var(--s-app-color-${color}--text)`,
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
    getAppColor,
    getIsAppColor,
    getPresetColor,
    getIsPresetColor,
    getPresetColorValue,
    getIsPredefinedPresetColor,
    getBackgroundColorAttributes,
  }
}
