import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { getNumericCssAttribute } from '~/lib'
import type { PropsTableBodyCell, PropsTableHeadCell, TableItem } from '~/types'

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
