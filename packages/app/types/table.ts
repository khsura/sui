import type { CSSProperties } from 'vue'

export enum TableSortOrder {
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
  sort?: (a: TableItem, b: TableItem, sortOrder?: TableSortOrder) => number
  rowspan?: number
  colspan?: number
  scope?: 'colgroup' | 'col'
}

/** A header as STable renders it: the user's header plus the layout fields computed for it. */
export type TableComputedHeader = TableHeader & {
  colspan: number
  rowspan: number
  isSticky: boolean
  isSticked: boolean | undefined
  index: number
}

/** Props of the dynamic `header.<column>` slot. */
export interface TableHeaderSlotProps {
  header: TableComputedHeader
  isSticked: boolean | undefined
}

/** Props shared by the row-level slots (`item.<column>`, `itemHeader`, `itemFooter`). */
export interface TableRowSlotProps<T extends TableItem = TableItem> {
  item: T
  value: T[keyof T]
  row: number
  group: string
  expand: () => void
  select: () => void
  isSelected: boolean
  isExpanded: boolean
}

/** Props of the dynamic `item.<column>` slot. */
export interface TableItemSlotProps<T extends TableItem = TableItem> extends TableRowSlotProps<T> {
  header: TableComputedHeader
  col: number
  isLeftSticked: boolean
}

/** Props of the `itemHeader` slot. */
export interface TableItemHeaderSlotProps<T extends TableItem = TableItem> extends TableRowSlotProps<T> {
  isLeftStickActive: boolean
}

/** Props of the `itemFooter` slot. */
export interface TableItemFooterSlotProps<T extends TableItem = TableItem> extends TableRowSlotProps<T> {
  isStickActive: boolean
}

/** Props of the `group` slot (rendered when `groupBy` is set). */
export interface TableGroupSlotProps<T extends TableItem = TableItem> {
  items: T[]
  group: string
  isFolded: boolean | undefined
  toggleFold: () => void
}
