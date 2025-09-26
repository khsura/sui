import { computed } from 'vue'
import { useTableCellCommonService } from '@khsura/sui/services/core'
import { type PropsTableHeadCell } from '@khsura/sui/definitions'

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
