import { getTableItemClass, getTableItemStyle, getTableRowClass, type TableItemClass, type TableItemStyle } from '~/index'

describe('Table helper', () => {
  describe('getTableItemClass', () => {
    it('should return class object from string', () => {
      const item = { id: 1, name: 'John' }
      const formatter = 'table-row'
      const result = getTableItemClass({ item, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ 'table-row': true })
    })

    it('should return class object from function that returns object', () => {
      const formatter: TableItemClass = (params) => {
        return {
          'table-row': params.item.id === 1,
          'table-row-selected': params.item.name === 'John',
        }
      }

      const result = getTableItemClass({ item: { id: 1, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ 'table-row': true, 'table-row-selected': true })

      const result2 = getTableItemClass({ item: { id: 2, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result2).toStrictEqual({ 'table-row-selected': true })

      const result3 = getTableItemClass({ item: { id: 1, name: 'Doe' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result3).toStrictEqual({ 'table-row': true })
    })

    it('should return class object from function that returns string', () => {
      const formatter: TableItemClass = (props) => {
        return props.item.id === 1 ? 'table-row' : 'table-row-selected'
      }

      const result = getTableItemClass({ item: { id: 1, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ 'table-row': true })

      const result2 = getTableItemClass({ item: { id: 2, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result2).toStrictEqual({ 'table-row-selected': true })
    })
  })

  describe('getTableItemStyle', () => {
    it('should return style object from string', () => {
      const item = { id: 1, name: 'John' }
      const formatter = { color: 'red' }
      const result = getTableItemStyle({ item, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ color: 'red' })
    })

    it('should return style object from function that returns object', () => {
      const formatter: TableItemStyle = (params) => {
        return {
          color: params.item.id === 1 ? 'red' : 'blue',
          backgroundColor: params.item.name === 'John' ? 'green' : 'yellow',
        }
      }

      const result = getTableItemStyle({ item: { id: 1, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ color: 'red', backgroundColor: 'green' })

      const result2 = getTableItemStyle({ item: { id: 2, name: 'John' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result2).toStrictEqual({ color: 'blue', backgroundColor: 'green' })

      const result3 = getTableItemStyle({ item: { id: 1, name: 'Doe' }, cellKey: 'id', cellType: 'cell' }, formatter)

      expect(result3).toStrictEqual({ color: 'red', backgroundColor: 'yellow' })
    })
  })

  describe('getTableRowClass', () => {
    it('should return class object from string', () => {
      const item = { id: 1, name: 'John' }
      const formatter = 'table-row'
      const result = getTableRowClass({ item, cellType: 'cell' }, formatter)

      expect(result).toStrictEqual({ 'table-row': true })
    })
  })
})
