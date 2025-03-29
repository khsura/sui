import { provide } from 'vue'
import { ProviderName } from '~/constants/provider'
import { type PropsGroupItem } from '~/definitions'
import { useGroupItemService } from './groupItemService'

export const useExpandableService = (props: PropsGroupItem) => {
  const { isSelected: isExpanded, toggleGroupItem: toggle } = useGroupItemService(props)

  provide(ProviderName.expansionPanel, { isExpanded, toggle })

  return {
    isExpanded,
    toggle,
  }
}
