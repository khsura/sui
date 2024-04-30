import { type AppThemeType } from '@sui/app/types'
import { computed } from 'vue'
import { getBrowserTheme } from '@sui/app/helpers'
import { useAppProviderService } from './appProviderService'

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
