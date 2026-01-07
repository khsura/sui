import { computed, inject } from 'vue'
import { getBrowserTheme } from '@/app/helpers'
import { type AppThemeType } from '@/app/types'
import { ProviderName } from '@/app/configs'

export const useThemeService = () => {
  const appState = inject(ProviderName.app)

  const theme = computed(() => {
    return appState?.theme
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
