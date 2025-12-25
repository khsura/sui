import { computed, inject } from 'vue'
import { useLayoutProviderService } from './layoutProviderService'
import { useProviderService } from './core'
import { ProviderName } from '@/app/constants'
import { type PropsApp, type AppState } from '@/app/definitions'
import { createAppStore } from '@/app/helpers/createAppStore'
import { isDarkColor } from '@/app/lib/color'

export const useAppService = (props: PropsApp) => {
  const { provide } = useProviderService()
  const store = inject<AppState>(props.name ?? 'sui', createAppStore())

  useLayoutProviderService(props)

  provide(ProviderName.sui, store)

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
