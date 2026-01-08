import { computed, inject } from 'vue'
import { getBrowserTheme } from '@/app/helpers'
import { type AppThemeType } from '@/app/types'
import { getPluginName } from '@/app/lib/getPluginName'
import type { AppState } from '@/app/definitions'

export const useThemeService = (appName?: string | symbol) => {
  const appState = inject<AppState>(getPluginName(appName))

  if (!appState) {
    throw new Error(`AppState for ${appName?.toString()} not found`)
  }

  const theme = computed(() => {
    return appState.theme
  })

  const setTheme = (theme: AppThemeType | null) => {
    if (appState) {
      appState.theme = theme ?? getBrowserTheme()
    }
  }

  return {
    theme,
    setTheme,
  }
}
