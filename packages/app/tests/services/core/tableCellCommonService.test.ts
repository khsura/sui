import { type Mutable } from '@vueuse/core'
import { useTableCellCommonService } from '@khsura/sui/services'
import { type PropsTableBodyCell } from '@khsura/sui/definitions'

describe('tableCellCommonService', () => {
  const defaultProps: PropsTableBodyCell = {
    header: {
      text: 'item1',
      value: 'item1',
      sortable: false,
      align: 'center',
      width: '100px',
      cellClass: 'testClass2',
    },
    item: {
      item1: 'item1',
    },
    cellKey: 'item1',
    cellClass: 'testClass1',
    cellType: 'cell',
    sticky: undefined,
    colspan: undefined,
    dense: undefined,
  }

  const data: {
    props: Mutable<PropsTableBodyCell>
  } = {
    props: defaultProps,
  }

  beforeEach(() => {
    data.props = { ...defaultProps }
  })

  test('style width should be same if scrollable is false', () => {
    const { cellStyle } = useTableCellCommonService(data.props)

    expect(cellStyle.value).toStrictEqual({ width: 'calc(100px + 0px)', minWidth: '100px' })
  })

  test('style width should be added by 20px if sortable is true', () => {
    if (data.props.header) {
      data.props.header.sortable = true
    }

    const { cellStyle } = useTableCellCommonService(data.props)

    expect(cellStyle.value).toStrictEqual({ width: 'calc(100px + 20px)', minWidth: '100px' })
  })
})
