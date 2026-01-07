import { computed, inject, provide } from 'vue'
import { useLayoutProviderService } from './layoutProviderService'
import { type PropsApp, type AppState } from '@/app/definitions'
import { isDarkColor } from '@/app/lib/color'
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

    const presetColorsTextObject = Object.fromEntries(
      Object.entries(presetColors.value).map(([key, property]) => {
        return [
          `--s-color-${key}--text`,
          isDarkColor(property) ? themes.value.dark?.appColors?.text : themes.value.light?.appColors?.text,
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
        return [
          `--s-app-color-${key}--text`,
          isDarkColor(property) ? themes.value.dark?.appColors?.text : themes.value.light?.appColors?.text,
        ]
      }),
    )

    return {
      ...presetColorsObject,
      ...presetColorsTextObject,
      ...appColorsObject,
      ...appColorsTextObject,
      ...appColorsThemeObject,
    }
  })

  return {
    styles,
  }
}
