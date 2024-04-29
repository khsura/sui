import { type PropsTableHeadCell } from '@/types'
import { useTableCellCommonService } from '@/services/core'
import { computed } from 'vue'

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
