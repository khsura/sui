import { ProviderName } from '@sui/app/constants'
import { createAppStore } from '@sui/app/helpers/createAppStore'
import { useProviderRepository } from './core'

export const useAppProviderRepository = () => {
  const { inject } = useProviderRepository()
  const config = inject(ProviderName.sui, createAppStore())

  return { config }
}
