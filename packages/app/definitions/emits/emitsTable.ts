import type { KTableSortOrder, TableItem } from '@khsura/sui/types'

export interface EmitsTable<T extends TableItem = TableItem> {
  'update:options': [{ pageIndex: number; itemsPerPage: number; sortBy: { key: string; order: KTableSortOrder }[] }]
  'update:expanded': [value: T[]]
  'update:selected': [value: T[]]
  'click:row': [value: { item: T; expand: () => void; isExpanded: boolean }]
}
