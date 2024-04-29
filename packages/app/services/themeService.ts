import { type AppThemeType } from '@sui/app/types'
import { computed } from 'vue'
import { useAppProviderService } from './appProviderService'
import { getBrowserTheme } from '@sui/app/helpers'

export const useThemeService = () => {
  const { config } = useAppProviderService()

  const theme = computed(() => {
    return config.theme
  })

  const setTheme = (theme: AppThemeType | null) => {
    config.theme = theme ?? getBrowserTheme()
  }

  return {
    theme,
    setTheme,
  }
}
