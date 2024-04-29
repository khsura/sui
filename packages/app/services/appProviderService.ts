import { ProviderName } from '@sui/app/constants'
import { createAppStore } from '@sui/app/helpers/createAppStore'
import { useProviderService } from './core'

export const useAppProviderService = () => {
  const { inject } = useProviderService()
  const config = inject(ProviderName.sui, createAppStore())

  return { config }
}
