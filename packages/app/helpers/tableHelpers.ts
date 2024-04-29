import { getCleanSetObject, getHtmlClassAttributeObject } from '@sui/app/lib'
import type { PropsTableBodyCell, TableItem, TableItemClass, TableItemStyle, TableRowClass } from '@sui/app/types'

export const getTableRowClass = <T extends TableItem = TableItem>(
  props: Pick<PropsTableBodyCell<T>, 'item' | 'cellType'>,
  itemRowClass: TableRowClass<T> | undefined,
) => {
  if (typeof itemRowClass === 'function') {
    return getCleanSetObject(getHtmlClassAttributeObject(itemRowClass(props)))
  }

  return getCleanSetObject(getHtmlClassAttributeObject(itemRowClass))
}

export const getTableItemClass = <T extends TableItem = TableItem, CellKey extends string = keyof TableItem>(
  props: Pick<PropsTableBodyCell<T, CellKey>, 'cellKey' | 'item' | 'cellType'>,
  cellClass: TableItemClass<T, CellKey> | undefined,
) => {
  if (typeof cellClass === 'function') {
    const { item, cellKey, cellType } = props

    return getCleanSetObject(getHtmlClassAttributeObject(cellClass({ item, cellKey, cellType })))
  }

  return getCleanSetObject(getHtmlClassAttributeObject(cellClass))
}

export const getTableItemStyle = <T extends TableItem = TableItem, CellKey extends string = keyof TableItem>(
  props: Pick<PropsTableBodyCell<T, CellKey>, 'cellKey' | 'item' | 'cellType'>,
  cellStyle: TableItemStyle<T, CellKey> | undefined,
) => {
  if (typeof cellStyle === 'function') {
    const { item, cellKey, cellType } = props

    return cellStyle({ item, cellKey, cellType })
  }

  return cellStyle
}
