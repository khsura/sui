import { computed, inject } from 'vue'
import type { AppState } from '@/app/definitions'
import { minimumTextContrast, readableTextMixStep } from '@/app/constants'
import { getReadableTextColor, getReadableTextVariant } from '@/app/lib/color'
import { getPluginName } from '@/app/lib/getPluginName'

/**
 * `s_textColor__<name>` reads `--s-color-<name>--readable`, which SApp tunes for the app background and cards.
 * A surface with a fixed colour of its own (the always-dark snackbar) redefines those variables for its subtree,
 * so a preset colour as text (`color="warning"` on a text button) reaches 4.5:1 on that surface instead.
 */
export const useSurfaceTextColorService = (surfaceColorName: string, appName?: string | symbol) => {
  const appState = inject<AppState | null>(getPluginName(appName), null)

  const styleListSurfaceTextColor = computed<Record<string, string>>(() => {
    if (!appState) {
      return {}
    }

    const { appColors, presetColors } = appState.themes[appState.theme]
    const surface = appColors[surfaceColorName]
    const lightText = appState.themes.dark.appColors.text
    const darkText = appState.themes.light.appColors.text

    if (!surface || !lightText || !darkText) {
      return {}
    }

    const surfaceText = getReadableTextColor(surface, lightText, darkText)

    return Object.fromEntries(
      Object.entries(presetColors).map(([name, color]) => [
        `--s-color-${name}--readable`,
        getReadableTextVariant(color, [surface], surfaceText, {
          minimumContrast: minimumTextContrast,
          step: readableTextMixStep,
        }),
      ]),
    )
  })

  return {
    styleListSurfaceTextColor,
  }
}
