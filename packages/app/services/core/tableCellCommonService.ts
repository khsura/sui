import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { getNumericCssAttribute } from '@/app/lib'
import type { TableItem } from '@/app/types'
import { type PropsTableHeadCell, type PropsTableBodyCell } from '@/app/definitions'

export const useTableCellCommonService = <T extends TableItem = TableItem>(
  props: PropsTableHeadCell | PropsTableBodyCell<T>,
) => {
  const cellStyle = computed(() => {
    if (!props.header) {
      return {}
    }

    const width = getNumericCssAttribute(props.header.width)

    return {
      ...(width ? { width: `calc(${width} + ${props.header.sortable ? '20px' : '0px'})`, minWidth: width } : {}),
    } satisfies CSSProperties
  })

  return {
    cellStyle,
  }
}
