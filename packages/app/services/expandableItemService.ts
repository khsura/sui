import { computed, inject } from 'vue'
import { useExpandableItemCoreService } from './core'
import { ProviderName } from '@/app/configs'

export const useExpandableItemService = () => {
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
