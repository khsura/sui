import { computed } from 'vue'
import { useAppProviderService } from './appProviderService'

export const useLocaleService = () => {
  const { config } = useAppProviderService()

  const locale = computed({
    get() {
      return config.locale
    },
    set(value) {
      config.locale = value
    },
  })

  return {
    locale,
  }
}
