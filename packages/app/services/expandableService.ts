import { provide } from 'vue'
import { ProviderName } from '@khsura/sui/constants/provider'
import { type PropsGroupItem } from '@khsura/sui/definitions'
import { useGroupItemService } from './groupItemService'

export const useExpandableService = (props: PropsGroupItem) => {
  const { isSelected: isExpanded, toggleGroupItem: toggle } = useGroupItemService(props)

  provide(ProviderName.expansionPanel, { isExpanded, toggle })

  return {
    isExpanded,
    toggle,
  }
}
