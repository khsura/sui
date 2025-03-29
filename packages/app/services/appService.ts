import { computed, inject } from 'vue'
import { ProviderName } from '~/constants'
import { type PropsApp } from '~/definitions'
import { createAppStore } from '~/helpers/createAppStore'
import { isDarkColor } from '~/lib/color'
import { type AppState } from '~/types'
import { useProviderService } from './core'
import { useLayoutProviderService } from './layoutProviderService'

export const useAppService = (props: PropsApp) => {
  useLayoutProviderService(props)
  const store = inject<AppState>(props.name ?? 'sui', createAppStore())
  const { provide } = useProviderService()

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
