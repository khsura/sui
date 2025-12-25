import { provide } from 'vue'
import { useGroupItemService } from './groupItemService'
import { ProviderName } from '@/app/constants/provider'
import { type PropsGroupItem } from '@/app/definitions'

export const useExpandableService = (props: PropsGroupItem) => {
  const { isSelected: isExpanded, toggleGroupItem: toggle } = useGroupItemService(props)

  provide(ProviderName.expansionPanel, { isExpanded, toggle })

  return {
    isExpanded,
    toggle,
  }
}
