import { computed } from 'vue'
import { getThemeColorMode } from '@/app/helpers/themeColorMode'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'
import type { ThemePreference } from '@/app/types'

export const useThemeService = (appName?: string | symbol) => {
  const { appState } = useAppProviderRepository(appName)
  const colorMode = getThemeColorMode(appState)
  /** Resolved theme actually applied ('light' | 'dark'). */
  const theme = computed(() => appState.theme)
  /** The user's persisted preference ('auto' | 'light' | 'dark'). */
  const preference = computed(() => appState.themePreference)

  /** Set the color-mode preference. `null` resets to 'auto' (follow OS). */
  const setTheme = (value: ThemePreference | null) => {
    colorMode.value = value ?? 'auto'
  }

  return {
    theme,
    preference,
    setTheme,
  }
}
