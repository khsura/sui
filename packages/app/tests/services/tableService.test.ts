import { type TableRowClass, type PropsTable } from '@sui/app/types'
import { useTableService } from '@sui/app/services'
import { ref } from 'vue'
import { type Mutable } from '@vueuse/core'
import { headers, items } from '../mocks/sTable'

const expanded = ref([items[3]])
const selected = ref([items[2]])
const dummyItemHeaderClass = 'dummyItemHeaderClass'
const dummyItemClass = 'dummyItemClass'

const props: Mutable<PropsTable> = {
  headers,
  items,
  itemKey: 'id',
  hideHeader: false,
  dense: false,
  multiSort: false,
  stickyHeader: false,
  singleExpand: false,
  itemHeader: 'category',
  itemFooter: 'footerMessage',
  groupBy: 'category',
  hideVerticalBorders: false,
  shadowExpandedContent: false,
  singleSelect: false,
  expanded: expanded.value,
  selected: selected.value,
  itemClass: dummyItemClass,
  itemRowClass: 'dummyItemRowClass',
  itemHeaderClass: dummyItemHeaderClass,
  tile: false,
  outlined: false,
  rounded: false,
  underlined: false,
}

const emit = vi.fn().mockImplementation((_event, _value) => {})

describe('useTableService', () => {
  test('getItemRowClass', () => {
    const { getItemRowClass } = useTableService(props, emit)

    expect(getItemRowClass({ item: items[0], cellType: 'cell' })).toStrictEqual({ dummyItemRowClass: true })

    const itemRowClass: TableRowClass = ({ cellType }) => {
      if (cellType === 'cell') {
        return 'dummyItemCellTypeClass'
      }

      return 'dummyItemClassOtherTypeClass'
    }

    props.itemRowClass = itemRowClass

    expect(getItemRowClass({ item: items[0], cellType: 'cell' })).toStrictEqual({ dummyItemCellTypeClass: true })
    expect(getItemRowClass({ item: items[0], cellType: 'footer' })).toStrictEqual({
      dummyItemClassOtherTypeClass: true,
    })
  })

  test('getIsSelected', () => {
    const { getIsSelected } = useTableService(props, emit)

    expect(getIsSelected(items[0])).toBe(false)

    props.singleSelect = true

    expect(getIsSelected(items[0])).toBe(false)
  })

  test('getIsExpanded', () => {
    props.singleExpand = false
    const { getIsExpanded } = useTableService(props, emit)

    expect(getIsExpanded(items[0])).toBe(true)

    props.singleExpand = true
    expect(getIsExpanded(items[0])).toBe(true)
  })

  test('toggleExpanded', () => {
    const { toggleExpanded } = useTableService(props, emit)

    expect(toggleExpanded(items[0])).toStrictEqual([items[3]])

    props.singleExpand = true
    expect(toggleExpanded(items[0])).toStrictEqual([items[3]])
  })

  test('toggleSelected', () => {
    const { toggleSelected } = useTableService(props, emit)

    expect(toggleSelected(items[1])).toStrictEqual([items[2]])

    props.singleSelect = true

    expect(toggleSelected(items[1])).toStrictEqual([items[2]])
  })

  test('groupedItems', () => {
    // To Do (Tahir) All test case needs to be tested
  })

  test('sortBy', () => {
    // To Do (Tahir) All test case needs to be tested
  })

  test('hasSubHeader return true if headers has colgroup', () => {
    const { hasSubHeader } = useTableService(props, emit)

    expect(hasSubHeader.value).toBe(true)
  })

  test('computedAllHeaders should return headers with colspan and rowspan', () => {
    const { computedAllHeaders } = useTableService(props, emit)

    expect(computedAllHeaders.value[0]).toStrictEqual({
      text: '番号',
      value: 'number',
      width: '20',
      sortable: true,
      colspan: 1,
      rowspan: 2,
      isSticky: false,
      index: 0,
      isSticked: false,
    })

    expect(computedAllHeaders.value[3]).toStrictEqual({
      text: 'Macros',
      scope: 'colgroup',
      value: 'macros',
      width: '100',
      colspan: 3,
      rowspan: 1,
      index: -1,
      isSticky: false,
      isSticked: false,
    })
  })

  test('headersGroup should return two groups of headers', () => {
    const { headersList: headersGroup } = useTableService(props, emit)

    expect(headersGroup.value.length).toBe(2)
    expect(headersGroup.value[0].length).toBe(5)
    expect(headersGroup.value[1].length).toBe(3)
  })

  test('computedColumnHeaders should return headers without colgroup', () => {
    const { computedColumnHeaders } = useTableService(props, emit)

    expect(computedColumnHeaders.value.length).toBe(7)
  })

  test('totalItemColumns should return total number of columns', () => {
    const { totalItemColumns } = useTableService(props, emit)

    expect(totalItemColumns.value).toBe(7)
  })

  describe('isStickActive', () => {
    test('isStickActive should return false if column props are not set', () => {
      const { isStickActive } = useTableService(props, emit)

      expect(isStickActive.value).toBe(false)
    })

    test('isStickActive should return true if column props are set and scrolled', () => {
      props.stickyHeader = true

      const { isStickActive, onHorizontalScroll } = useTableService(
        { ...props, stickyLeftColumnsStart: 0, stickyLeftColumnsSize: 1 },
        emit,
      )

      onHorizontalScroll(10)
      expect(isStickActive.value).toBe(true)
    })

    test('isStickActive should return false if column props are not set and scrolled', () => {
      props.stickyHeader = true

      const { isStickActive, onHorizontalScroll } = useTableService(
        { ...props, stickyLeftColumnsStart: 0, stickyLeftColumnsSize: 0 },
        emit,
      )

      onHorizontalScroll(10)
      expect(isStickActive.value).toBe(false)
    })
  })
})
