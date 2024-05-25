import { ProviderName } from '@khsura/sui/constants/provider'
import { computed } from 'vue'
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
