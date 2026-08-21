import type { TableSortOrder, TableItem } from '@/app/types'

export interface EmitsTable<T extends TableItem = TableItem> {
  'update:options': [{ pageIndex: number; itemsPerPage: number; sortBy: { key: string; order: TableSortOrder }[] }]
  'update:expanded': [value: T[]]
  'update:selected': [value: T[]]
  'click:row': [value: { item: T; expand: () => void; isExpanded: boolean }]
}
