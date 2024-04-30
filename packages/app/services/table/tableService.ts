import {
  type EmitTable,
  type PropsTable,
  type TableItem,
  KTableSortOrder,
  type TableHeader,
  type TableItemCellType,
} from '@sui/app/types'
import { computed, ref } from 'vue'
import { type STableHeadCell } from '@sui/app/components/table'
import { getCleanSetObject, getNumericCssAttribute } from '@sui/app/lib'
import { uniqueId } from '@sui/app/vendors/lodash'
import { getTableRowClass } from '@sui/app/helpers'
import { z } from 'zod'
import { store } from '@sui/app/store'

export const useTableService = <T extends TableItem = TableItem>(props: PropsTable<T>, emit: EmitTable<T>) => {
  const isMounted = ref(false)
  const sortOrders = ref<Record<string, KTableSortOrder | undefined>>({})
  const tableWrapperElement = ref<HTMLElement | null>(null)
  const headerElements = ref<Array<InstanceType<typeof STableHeadCell>>>([])
  const tableId = ref(uniqueId())
  const isStickActive = ref(false)

  const stickyLeftColumnsStart = computed(() => {
    const validationResult = z.coerce
      .number()
      .min(0)
      .max(props.headers.length - 1 > 0 ? props.headers.length - 1 : 0)
      .int()
      .safeParse(props.stickyLeftColumnsStart ?? 0)

    return validationResult.success ? validationResult.data : 0
  })

  const stickyLeftColumnSize = computed(() => {
    const validationResult = z.coerce
      .number()
      .min(0)
      .max(props.headers.length)
      .int()
      .safeParse(props.stickyLeftColumnsSize ?? 0)

    return validationResult.success ? validationResult.data : 0
  })

  const getIsStickActive = (scrollLeft: number) => {
    if (scrollLeft === 0) {
      return false
    }

    if (stickyLeftColumnsStart.value === 0 && stickyLeftColumnSize.value === 0) {
      return false
    }

    if (stickyLeftColumnSize.value === 0) {
      return false
    }

    const left = headerElements.value
      .slice(0, stickyLeftColumnsStart.value + (props.stickyLeftColumnsOffset ?? 0))
      .reduce((pre, cur) => {
        return pre + cur.$el?.getBoundingClientRect().width
      }, 0)

    return left !== undefined && scrollLeft >= left
  }

  const expanded = computed<T[]>({
    get() {
      return props.expanded ?? []
    },
    set(value) {
      emit('update:expanded', value)
    },
  })

  const selected = computed<T[]>({
    get() {
      return props.selected ?? []
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  const getCurrentItemKey = () => {
    if (!props.itemKey && props.headers.length > 0) {
      return props.headers.find((header) => !!header.value)?.value
    }

    return props.itemKey
  }

  const getIsExpanded = (item: T) => {
    const currentItemKey = getCurrentItemKey()

    if (currentItemKey) {
      if (props.singleExpand && expanded.value.length > 0) {
        return expanded.value[0][currentItemKey] === item[currentItemKey]
      }

      return expanded.value.some((e) => e[currentItemKey] === item[currentItemKey])
    }

    return false
  }

  const toggleExpanded = (item: T) => {
    const currentItemKey = getCurrentItemKey()
    const index = currentItemKey ? expanded.value.findIndex((e) => e[currentItemKey] === item[currentItemKey]) : -1

    if (props.singleExpand) {
      expanded.value = index > -1 ? [] : [item]
    } else {
      if (index > -1) {
        expanded.value.splice(index, 1)
      } else {
        expanded.value = [...expanded.value, item]
      }
    }

    return expanded.value
  }

  const getIsSelected = (item: T) => {
    if (props.singleSelect) {
      return selected.value[0] === item
    }

    return selected.value.includes(item)
  }

  const toggleSelected = (item: T) => {
    const index = selected.value.indexOf(item)

    if (props.singleSelect) {
      selected.value = index > -1 ? [] : [item]
    } else {
      if (index > -1) {
        selected.value.splice(index, 1)
      } else {
        selected.value = [...new Set([...selected.value, item])]
      }
    }

    return selected.value
  }

  const sortedItems = computed(() => {
    const sorted = [...props.items].sort((a, b) => {
      const sorters = props.multiSort ? Object.entries(sortOrders.value) : Object.entries(sortOrders.value).slice(0, 1)

      const sorter = sorters.reduce((pre, cur) => {
        const [header, order] = cur
        const headerInfo = props.headers.find(({ value }) => value === header)

        if (headerInfo?.sortable === false) {
          return 0
        }

        if (headerInfo?.sort) {
          return headerInfo.sort(a, b)
        }

        const aValue = a[header]
        const bValue = b[header]

        const aValueNumeric =
          typeof aValue === 'string' || typeof aValue === 'number'
            ? Number(aValue.toString().replace(/%/, ''))
            : Number.NaN

        const bValueNumeric =
          typeof bValue === 'string' || typeof bValue === 'number'
            ? Number(bValue.toString().replace(/%/, ''))
            : Number.NaN

        const isANumeric = !Number.isNaN(aValueNumeric)
        const isBNumeric = !Number.isNaN(bValueNumeric)

        if (pre === 0) {
          if (aValue === bValue) {
            return 0
          }

          if (isANumeric && !isBNumeric) {
            return -1
          }

          if (!isANumeric && isBNumeric) {
            return 1
          }

          if (order === KTableSortOrder.ascending) {
            if (isANumeric && isBNumeric) {
              return aValueNumeric - bValueNumeric
            }

            if (
              (typeof aValue === 'number' || typeof aValue === 'string') &&
              (typeof bValue === 'number' || typeof bValue === 'string')
            ) {
              return aValue > bValue ? 1 : -1
            }
          }

          if (order === KTableSortOrder.descending) {
            if (isANumeric && isBNumeric) {
              return bValueNumeric - aValueNumeric
            }

            if (
              (typeof aValue === 'number' || typeof aValue === 'string') &&
              (typeof bValue === 'number' || typeof bValue === 'string')
            ) {
              return bValue > aValue ? 1 : -1
            }
          }

          return 0
        }

        return pre
      }, 0)

      return sorter
    })

    return sorted
  })

  const groupedItems = computed<Array<{ name: string; items: T[] }>>(() => {
    const items = [...sortedItems.value]
    const groupBy = typeof props.groupBy === 'string' ? [props.groupBy] : props.groupBy
    const groupedItemObjects: Record<string, T[]> = {}

    if (!groupBy || groupBy.length === 0) {
      return [{ name: '', items }]
    }

    items.forEach((item) => {
      const groupName = groupBy.map((key) => item[key]).join(' ')

      if (groupedItemObjects[groupName] === undefined) {
        groupedItemObjects[groupName] = []
      }

      groupedItemObjects[groupName].push(item)
    })

    return Object.entries(groupedItemObjects).map(([name, items]) => ({ name, items }))
  })

  const getItemRowClass = (data: { item: T; cellType: TableItemCellType }) => {
    return getTableRowClass(data, props.itemRowClass)
  }

  const hasSubHeader = computed(() => {
    return props.headers.some((header) => header.scope === 'colgroup')
  })

  const computedAllHeaders = computed(() => {
    let index = 0

    return props.headers.map((header, i) => {
      const isSticky = header.scope !== 'colgroup' && getIsStickyCell(index)
      const isSticked = isSticky && isStickActive.value

      if (header.scope === 'colgroup' && !header.colspan) {
        const colspan =
          header.colspan ??
          props.headers.slice(i + 1).reduce((pre, cur, i, array) => {
            if (cur.scope === 'col') {
              return pre + 1
            }

            array.splice(i)

            return pre
          }, 0)

        return {
          ...header,
          colspan,
          rowspan: 1,
          isSticky,
          isSticked,
          index: -1,
        }
      }

      const colHeaders = {
        ...header,
        colspan: header.colspan ?? 1,
        rowspan: header.rowspan ?? (hasSubHeader.value ? (header.scope === 'col' ? 1 : 2) : 1),
        isSticky,
        isSticked,
        index,
      }

      index += header.scope === 'colgroup' ? 0 : 1

      return colHeaders
    })
  })

  const getIsStickyCell = (index: number) => {
    const start = props.stickyLeftColumnsStart ?? 0
    const size = props.stickyLeftColumnsSize ?? 0

    return start <= index && index < start + size
  }

  const getCellInfo = (header: TableHeader) => {
    return computedColumnHeaders.value.find((col) => col.value === header.value)
  }

  const headersList = computed(() => {
    return [
      computedAllHeaders.value.filter((header) => header.scope !== 'col'),
      computedAllHeaders.value.filter((header) => header.scope === 'col'),
    ].filter((group) => group.length > 0)
  })

  const computedColumnHeaders = computed(() => {
    return computedAllHeaders.value.filter((header) => header.scope !== 'colgroup')
  })

  const totalItemColumns = computed(() => {
    return computedColumnHeaders.value.length
  })

  const onHorizontalScroll = (value = tableWrapperElement.value?.scrollLeft ?? 0) => {
    const isStickActiveNewValue = getIsStickActive(value)

    if (isStickActive.value !== isStickActiveNewValue) {
      isStickActive.value = isStickActiveNewValue
    }
  }

  const getStickLeftValue = (header: TableHeader) => {
    if (!isMounted.value) {
      return undefined
    }

    if (header.scope === 'colgroup') {
      return undefined
    }

    const cell = getCellInfo(header)

    if (!cell?.isSticked || !store.width || !tableId.value) {
      return undefined
    }

    return headerElements.value.slice(stickyLeftColumnsStart.value, cell.index).reduce((pre, cur) => {
      return pre + cur.$el?.getBoundingClientRect().width
    }, 0)
  }

  const getTableCellStyle = (header: TableHeader) => {
    const left = getStickLeftValue(header)

    return getCleanSetObject({
      left: left !== undefined ? getNumericCssAttribute(left) : undefined,
    })
  }

  const onClickRow = (item: T) => {
    emit('click:row', {
      item,
      expand: () => toggleExpanded(item),
      isExpanded: getIsExpanded(item),
    })
  }

  const updateTable = () => {
    tableId.value = uniqueId()
  }

  return {
    isMounted,
    computedAllHeaders,
    computedColumnHeaders,
    groupedItems,
    hasSubHeader,
    headerElements,
    headersList,
    sortedItems,
    sortOrders,
    tableWrapperElement,
    totalItemColumns,
    isStickActive,
    getCellInfo,
    getIsExpanded,
    getIsSelected,
    getIsStickyCell,
    getItemRowClass,
    getTableCellStyle,
    onClickRow,
    toggleExpanded,
    toggleSelected,
    onHorizontalScroll,
    updateTable,
  }
}
