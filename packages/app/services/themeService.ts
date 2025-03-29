import { computed } from 'vue'
import { getBrowserTheme } from '~/helpers'
import { type AppThemeType } from '~/types'
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
