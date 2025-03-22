import { computed } from 'vue'
import { ProviderName } from '@khsura/sui/constants/provider'
import { useExpandableItemCoreService, useProviderService } from './core'

export const useExpandableItemService = () => {
  const { inject } = useProviderService()

  const { isExpanded, toggle } = inject(ProviderName.expansionPanel, {
    isExpanded: computed(() => null),
    toggle: () => undefined,
  })

  const { maxHeight } = useExpandableItemCoreService(isExpanded)

  return {
    isExpanded,
    maxHeight,
    toggle,
  }
}
