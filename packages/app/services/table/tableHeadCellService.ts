import { type PropsTableHeadCell } from '@sui/app/types'
import { useTableCellCommonService } from '@sui/app/services/core'
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
