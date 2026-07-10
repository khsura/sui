import type { CSSProperties } from 'vue'

export enum KTableSortOrder {
  ascending = 'asc',
  descending = 'desc',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableItem<T extends Record<string, any> = Record<string, any>> = T

export type TableItemCellType = 'footer' | 'header' | 'cell' | 'expansion'

export type TableRowClass<T extends TableItem = TableItem> =
  | string
  | string[]
  | Record<string, boolean>
  | ((data: { item: T; cellType: TableItemCellType }) => string | string[] | Record<string, boolean>)

export type TableItemClass<T extends TableItem = TableItem, CellKey extends string = string> =
  | string
  | string[]
  | Record<string, boolean>
  | ((data: { item: T; cellKey: CellKey; cellType: TableItemCellType }) => string | string[] | Record<string, boolean>)

export type TableItemStyle<T extends TableItem = TableItem, CellKey extends string = string> =
  CSSProperties | ((data: { item: T; cellKey: CellKey; cellType: TableItemCellType }) => CSSProperties)

export interface TableHeader<V extends string | number | symbol = string> {
  text: string
  value: V
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  groupable?: boolean
  class?: string | string[] | Record<string, boolean | null | undefined> | undefined
  cellClass?: TableItemClass | undefined
  cellStyle?: TableItemStyle | undefined
  width?: string | number
  textWrap?: boolean
  noGutters?: boolean
  cellNoGutters?: boolean
  sort?: (a: TableItem, b: TableItem, sortOrder?: KTableSortOrder) => number
  rowspan?: number
  colspan?: number
  scope?: 'colgroup' | 'col'
}
