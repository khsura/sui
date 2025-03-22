import { type Mutable } from '@vueuse/core'
import { useTableHeadCellService } from '@khsura/sui/services'
import { type PropsTableHeadCell } from '@khsura/sui/types'

describe('tableHeadCellService', () => {
  const defaultProps: PropsTableHeadCell = {
    header: {
      text: 'item1',
      value: 'item1',
      sortable: false,
      align: 'center',
      width: '100px',
      cellClass: 'cellClass1',
    },
    multiSort: undefined,
    sticky: undefined,
    dense: undefined,
  }

  const data: {
    props: Mutable<PropsTableHeadCell>
  } = {
    props: defaultProps,
  }

  beforeEach(() => {
    data.props = { ...defaultProps }
  })

  test('service returns cellStyle', () => {
    const { cellStyle } = useTableHeadCellService(data.props)

    expect(cellStyle.value).toStrictEqual({ width: 'calc(100px + 0px)', minWidth: '100px' })
  })

  test('isScopeColType returns true if header scope is not colgroup', () => {
    const { isScopeColType } = useTableHeadCellService(data.props)

    expect(isScopeColType.value).toBe(true)
  })

  test('isScopeColType returns false if header scope is colgroup', () => {
    data.props.header.scope = 'colgroup'
    const { isScopeColType } = useTableHeadCellService(data.props)

    expect(isScopeColType.value).toBe(false)
  })
})
