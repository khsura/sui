import { computed, inject, provide } from 'vue'
import { useLayoutProviderService } from './layoutProviderService'
import { type PropsApp, type AppState } from '@/app/definitions'
import { getReadableTextColor, getReadableTextVariant, isDarkColor } from '@/app/lib/color'
import { minimumTextContrast, readableTextMixStep } from '@/app/constants'
import { ProviderName } from '@/app/configs'
import { getPluginName } from '@/app/lib/getPluginName'

export const useAppService = (props: PropsApp) => {
  // AppLevel Provider -> Inject
  const store = inject<AppState>(getPluginName(props.name))

  if (!store) {
    throw new Error('AppLevel Provider config not found')
  }

  // Provide from SApp Component
  provide(ProviderName.app, store)

  useLayoutProviderService(props, store)

  const presetColors = computed(() => {
    return store.themes[store.theme].presetColors
  })

  const appColors = computed(() => {
    return store.themes[store.theme].appColors
  })

  const themes = computed(() => {
    return store.themes
  })

  const styles = computed(() => {
    const appColorsThemeObjectEntries = Object.entries(themes.value).map(([theme, config]) => {
      return Object.entries(config.appColors ?? {}).map(([key, property]) => {
        return [`--s-app-color-${key}--${theme}`, property] as const
      })
    })

    const appColorsThemeObject = Object.fromEntries(appColorsThemeObjectEntries.flat())

    const presetColorsObject = Object.fromEntries(
      Object.entries(presetColors.value).map(([key, property]) => {
        return [`--s-color-${key}`, property]
      }),
    )

    // The on-colour of each preset and app colour is whichever theme text colour contrasts more with it (WCAG ratio).
    const getOnColor = (background: string) => {
      const lightText = themes.value.dark?.appColors?.text
      const darkText = themes.value.light?.appColors?.text

      if (!lightText || !darkText) {
        return isDarkColor(background) ? lightText : darkText
      }

      return getReadableTextColor(background, lightText, darkText)
    }

    const presetColorsTextObject = Object.fromEntries(
      Object.entries(presetColors.value).map(([key, property]) => {
        return [`--s-color-${key}--text`, getOnColor(property)]
      }),
    )

    // Each preset as text (`s_textColor__<name>`, text buttons, outlined chips): nudged toward the theme text
    // colour until it reaches 4.5:1 on the app background and on cards, e.g. primary on a dark card.
    const { background, card, text } = appColors.value

    const presetColorsReadableObject = Object.fromEntries(
      Object.entries(presetColors.value).map(([key, property]) => {
        return [
          `--s-color-${key}--readable`,
          getReadableTextVariant(property, [background, card], text, {
            minimumContrast: minimumTextContrast,
            step: readableTextMixStep,
          }),
        ]
      }),
    )

    const appColorsObject = Object.fromEntries(
      Object.entries(appColors.value).map(([key, property]) => {
        return [`--s-app-color-${key}`, property]
      }),
    )

    const appColorsTextObject = Object.fromEntries(
      Object.entries(appColors.value).map(([key, property]) => {
        return [`--s-app-color-${key}--text`, getOnColor(property)]
      }),
    )

    return {
      ...presetColorsObject,
      ...presetColorsTextObject,
      ...presetColorsReadableObject,
      ...appColorsObject,
      ...appColorsTextObject,
      ...appColorsThemeObject,
    }
  })

  return {
    styles,
  }
}
