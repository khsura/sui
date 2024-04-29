import { KTableSortOrder } from '@sui/app/types'

export const getNextSortOrder = (currentSortOrder: KTableSortOrder | undefined) => {
  if (currentSortOrder === undefined) {
    return KTableSortOrder.ascending
  }

  if (currentSortOrder === KTableSortOrder.ascending) {
    return KTableSortOrder.descending
  }

  return undefined
}
