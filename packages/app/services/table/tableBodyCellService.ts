import type { PropsTableBodyCell, TableItem } from '@sui/app/definitions'
import { getTableItemClass, getTableItemStyle } from '@sui/app/helpers'
import { useTableCellCommonService } from '@sui/app/services/core'
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

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
