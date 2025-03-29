import { ProviderName } from '~/constants'
import { createAppStore } from '~/helpers/createAppStore'
import { useProviderRepository } from './core'

export const useAppProviderRepository = () => {
  const { inject } = useProviderRepository()
  const config = inject(ProviderName.sui, createAppStore())

  return { config }
}
