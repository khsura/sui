import { ProviderName } from '@khsura/sui/constants'
import { createAppStore } from '@khsura/sui/helpers/createAppStore'
import { useProviderRepository } from './core'

export const useAppProviderRepository = () => {
  const { inject } = useProviderRepository()
  const config = inject(ProviderName.sui, createAppStore())

  return { config }
}
