import { type PropsTableHeadCell } from '@khsura/sui/types'
import { useTableCellCommonService } from '@khsura/sui/services/core'
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
