import { computed } from 'vue'
import { useTableCellCommonService } from '~/services/core'
import { type PropsTableHeadCell } from '~/types'

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
