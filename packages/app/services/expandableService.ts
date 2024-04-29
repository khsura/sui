import { ProviderName } from '@sui/app/constants/provider'
import { type PropsGroupItem } from '@sui/app/definitions'
import { provide } from 'vue'
import { useGroupItemService } from './groupItemService'

export const useExpandableService = (props: PropsGroupItem) => {
  const { isSelected: isExpanded, toggleGroupItem: toggle } = useGroupItemService(props)

  provide(ProviderName.expansionPanel, { isExpanded, toggle })

  return {
    isExpanded,
    toggle,
  }
}
