import { computed } from 'vue'
import { useAppProviderService } from './appProviderService'
import { getBrowserTheme } from '@/app/helpers'
import { type AppThemeType } from '@/app/types'

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
