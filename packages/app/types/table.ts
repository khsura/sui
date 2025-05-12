import type { TableItem, TableItemClass, TableItemCellType, TableItemStyle, TableRowClass, TableHeader } from './core'

export interface PropsTableHeadCell {
  header: TableHeader
  multiSort?: boolean | null | undefined
  sticky?: boolean | undefined
  dense?: boolean | undefined | null
}

export interface PropsTableBodyCell<T extends TableItem = TableItem, CellKey extends string = string> {
  header?: TableHeader | undefined
  item: T
  cellClass?: TableItemClass<T> | undefined
  cellStyle?: TableItemStyle<T> | undefined
  sticky?: boolean | undefined
  colspan?: number | undefined
  dense?: boolean | undefined | null
  cellKey: CellKey
  cellType: TableItemCellType
}

export type PropsTable<T extends TableItem = TableItem, C extends string = keyof TableItem> = {
  dense?: boolean | undefined
  expanded?: T[] | undefined
  groupBy?: string | string[] | undefined
  headers: TableHeader[]
  hideHeader?: boolean | undefined
  hideVerticalBorders?: boolean | undefined
  hideTopBottomBorders?: boolean | undefined
  itemClass?: TableItemClass<T, C> | undefined
  itemStyle?: TableItemStyle<T, C> | undefined
  itemFooter?: string | undefined
  itemFooterClass?: TableItemClass<T, C> | undefined
  itemFooterStyle?: TableItemStyle<T, C> | undefined
  itemHeader?: string | undefined
  itemHeaderClass?: TableItemClass<T, C> | undefined
  itemHeaderStyle?: TableItemStyle<T, C> | undefined
  itemKey?: string | undefined
  itemRowClass?: TableRowClass<T> | undefined
  items: T[]
  multiSort?: boolean | undefined
  outlined?: boolean | undefined
  rounded?: boolean | undefined
  selected?: T[] | undefined
  shadowExpandedContent?: boolean | undefined
  singleExpand?: boolean | undefined
  singleSelect?: boolean | undefined
  stickyHeader?: boolean | undefined
  stickyLeftColumnsSize?: number | undefined
  stickyLeftColumnsStart?: number | undefined
  stickyLeftColumnsOffset?: number | undefined
  tile?: boolean | undefined
  underlined?: boolean | undefined
}

export interface EmitTable<T extends TableItem = TableItem> {
  (event: 'update:expanded', value: T[]): void
  (event: 'update:selected', value: T[]): void
  (event: 'click:row', value: { item: T; expand: () => void; isExpanded: boolean }): void
}
