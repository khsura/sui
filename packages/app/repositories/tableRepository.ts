import { TableSortOrder } from '@/app/types'

export const getNextSortOrder = (currentSortOrder: TableSortOrder | undefined) => {
  if (currentSortOrder === undefined) {
    return TableSortOrder.ascending
  }

  if (currentSortOrder === TableSortOrder.ascending) {
    return TableSortOrder.descending
  }

  return undefined
}
