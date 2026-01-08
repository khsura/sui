import { type Mutable } from '@vueuse/core'
import { useTableBodyCellService } from '@/app/services'
import { type PropsTableBodyCell } from '@/app/definitions'

describe('tableBodyCellService', () => {
  const defaultProps: PropsTableBodyCell = {
    header: {
      text: 'item1',
      value: 'item1',
      sortable: false,
      align: 'center',
      width: '100px',
      cellClass: 'cellClass1',
    },
    item: {
      item1: 'item1',
    },
    cellClass: 'cellClass2',
    cellKey: 'item1',
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

  test('service returns cellStyle and itemClasses', () => {
    const { itemStyles, itemClasses } = useTableBodyCellService(data.props)

    expect(itemStyles.value).toStrictEqual({ width: 'calc(100px + 0px)', minWidth: '100px' })
    expect(itemClasses.value).toStrictEqual({ cellClass1: true, cellClass2: true })
  })
})
