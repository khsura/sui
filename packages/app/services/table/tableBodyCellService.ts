import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { getTableItemClass, getTableItemStyle } from '@/app/helpers'
import { useTableCellCommonService } from '@/app/services/core'
import type { PropsTableBodyCell } from '@/app/definitions'
import type { TableItem } from '@/app/types'

export const useTableBodyCellService = <T extends TableItem = TableItem, CellKey extends string = string>(
  props: PropsTableBodyCell<T, CellKey>,
) => {
  const { cellStyle } = useTableCellCommonService(props)

  const itemClasses = computed(() => {
    return {
      ...getTableItemClass(props, props.cellClass),
      ...(props.cellType === 'cell' ? getTableItemClass(props, props.header?.cellClass) : {}),
    }
  })

  const itemStyles = computed<CSSProperties>(() => {
    return {
      ...cellStyle.value,
      ...getTableItemStyle(props, props.cellStyle),
      ...(props.cellType === 'cell' ? getTableItemStyle(props, props.header?.cellStyle) : {}),
    }
  })

  return {
    itemStyles,
    itemClasses,
  }
}
