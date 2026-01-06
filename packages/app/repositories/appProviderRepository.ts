import { inject } from 'vue'
import { ProviderName } from '@/app/configs'
import { createAppStore } from '@/app/helpers'

export const useAppProviderRepository = () => {
  const config = inject(ProviderName.sui, createAppStore('sui'))

  return { config }
}
