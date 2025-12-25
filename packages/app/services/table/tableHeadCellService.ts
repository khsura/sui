import { computed } from 'vue'
import { useTableCellCommonService } from '@/app/services/core'
import { type PropsTableHeadCell } from '@/app/definitions'

export const useTableHeadCellService = (props: PropsTableHeadCell) => {
  const { cellStyle } = useTableCellCommonService(props)

  const isScopeColType = computed(() => {
    return props.header.scope !== 'colgroup'
  })

  return {
    cellStyle,
    isScopeColType,
  }
}
