import { computed, ref, type Ref, type EmitFn, type ShallowRef } from 'vue'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import type STableHeadCell from '@/app/components/table/sTableHeadCell.vue'
import { getTableRowClass } from '@/app/helpers'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import { store } from '@/app/store'
import { type TableItem, TableSortOrder, type TableHeader, type TableItemCellType } from '@/app/types'
import type { EmitsTable, PropsTable } from '@/app/definitions'

export const useTableService = <T extends TableItem = TableItem>(
  props: PropsTable<T>,
  emit: EmitFn<EmitsTable<T>>,
  itemsPerPage: Ref<number | undefined>,
  headerElements: Readonly<ShallowRef<(InstanceType<typeof STableHeadCell> | null)[] | null>>,
  tableWrapperElement: Readonly<ShallowRef<HTMLDivElement | null>>,
) => {
  const isMounted = ref(false)
  const sortOrders = ref<Record<string, TableSortOrder | undefined>>({})
  const tableId = ref(uuidv4())
  const isLeftStickActive = ref(false)
  const pageIndex = ref(0)

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

  const getIsLeftStickActive = (scrollLeft: number) => {
    if (scrollLeft === 0) {
      return false
    }

    if (stickyLeftColumnsStart.value === 0 && stickyLeftColumnSize.value === 0) {
      return false
    }

    if (stickyLeftColumnSize.value === 0) {
      return false
    }

    const left = [...(headerElements.value ?? [])]
      .slice(0, stickyLeftColumnsStart.value + (props.stickyLeftColumnsOffset ?? 0))
      .reduce((pre: number, cur) => {
        return pre + (cur?.$el?.getBoundingClientRect().width ?? 0)
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
          return headerInfo.sort(a, b, sortOrders.value[header])
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

          if (order === TableSortOrder.ascending) {
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

          if (order === TableSortOrder.descending) {
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
      if (itemsPerPage.value) {
        if (props.totalItems && props.totalItems > items.length) {
          return [{ name: '', items }]
        }

        return [
          {
            name: '',
            items: items.slice(pageIndex.value * itemsPerPage.value, (pageIndex.value + 1) * itemsPerPage.value),
          },
        ]
      }

      return [{ name: '', items }]
    }

    items.forEach((item) => {
      const groupName = groupBy.map((key) => item[key]).join(' ')

      groupedItemObjects[groupName] ??= []

      groupedItemObjects[groupName].push(item)

      return
    })

    const groupedItems = Object.entries(groupedItemObjects).map(([name, items]) => ({ name, items }))
    const itemsPerPageValue = itemsPerPage.value

    if (itemsPerPageValue) {
      if (props.totalItems && props.totalItems > items.length) {
        return groupedItems
      }

      let currentIndex = 0
      const startIndex = pageIndex.value * itemsPerPageValue
      const endIndex = (pageIndex.value + 1) * itemsPerPageValue

      return groupedItems.reduce<Array<{ name: string; items: T[] }>>((acc, group) => {
        const groupLength = group.items.length

        // Check if this group contains items in the current page range
        if (currentIndex + groupLength > startIndex && currentIndex < endIndex) {
          const groupStartIndex = Math.max(0, startIndex - currentIndex)
          const groupEndIndex = Math.min(groupLength, endIndex - currentIndex)

          acc.push({
            ...group,
            items: group.items.slice(groupStartIndex, groupEndIndex),
          })
        }

        currentIndex += groupLength

        return acc
      }, [])
    }

    return groupedItems
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
      const isStickyLeft = getIsStickyLeftCell(index)
      const isStickyRight = getIsStickyRightCell(index)
      const isSticky = header.scope !== 'colgroup' && (isStickyLeft || isStickyRight)
      const isSticked = (isStickyLeft && isLeftStickActive.value) || (isStickyRight && props.stickyRightColumn)

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

  const getIsStickyRightCell = (index: number) => {
    return (props.stickyRightColumn && index === props.headers.length - 1) ?? false
  }

  const getIsStickyLeftCell = (index: number) => {
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
    const isStickActiveNewValue = getIsLeftStickActive(value)

    if (isLeftStickActive.value !== isStickActiveNewValue) {
      isLeftStickActive.value = isStickActiveNewValue
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

    return [...(headerElements.value ?? [])].slice(stickyLeftColumnsStart.value, cell.index).reduce((pre, cur) => {
      return pre + (cur?.$el?.getBoundingClientRect().width ?? 0)
    }, 0)
  }

  const getTableCellStyle = (header: TableHeader) => {
    if (props.stickyRightColumn && props.headers[props.headers.length - 1].value === header.value) {
      return getCleanSetObject({
        right: 0,
      })
    }

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
    tableId.value = uuidv4()
  }

  return {
    pageIndex,
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
    isLeftStickActive,
    getCellInfo,
    getIsExpanded,
    getIsSelected,
    getIsStickyLeftCell,
    getItemRowClass,
    getTableCellStyle,
    onClickRow,
    toggleExpanded,
    toggleSelected,
    onHorizontalScroll,
    updateTable,
  }
}
