import { useProviderRepository } from './core'
import { ProviderName } from '@/app/constants'
import { createAppStore } from '@/app/helpers/createAppStore'

export const useAppProviderRepository = () => {
  const { inject } = useProviderRepository()
  const config = inject(ProviderName.sui, createAppStore())

  return { config }
}
