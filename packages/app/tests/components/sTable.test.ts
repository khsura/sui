import { STable } from '@/app/components'
import { mountWithApp } from '@/app/tests/_helpers'

describe('STable', () => {
  const headers = [
    { text: 'Name', value: 'name' },
    { text: 'Role', value: 'role' },
  ]

  const items = [
    { name: 'Bat', role: 'admin' },
    { name: 'Dorj', role: 'admin' },
    { name: 'Saraa', role: 'user' },
  ]

  const getSTable = (props: Record<string, unknown> = {}) => {
    return mountWithApp(STable, { props: { headers, items, groupBy: 'role', ...props } })
  }

  test('does not fold groups when foldable is false', () => {
    const wrapper = getSTable({ folded: ['admin'] })

    expect(wrapper.find('.s_table__groupFoldIcon').exists()).toBe(false)
    expect(wrapper.text()).toContain('Bat')
  })

  test('folds every group when folded is true', () => {
    const wrapper = getSTable({ foldable: true, folded: true })

    expect(wrapper.text()).not.toContain('Bat')
    expect(wrapper.text()).not.toContain('Saraa')
  })

  test('unfolds only the clicked group when folded is true', async () => {
    const wrapper = getSTable({ foldable: true, folded: true })

    await wrapper.find('.s_table__groupRow--foldable').trigger('click')

    expect(wrapper.emitted('update:folded')?.[0]).toEqual([['user']])
  })

  test('hides the rows of a group listed in folded', () => {
    const wrapper = getSTable({ foldable: true, folded: ['admin'] })

    expect(wrapper.text()).not.toContain('Bat')
    expect(wrapper.text()).toContain('Saraa')
  })

  test('emits update:folded when a group row is clicked', async () => {
    const wrapper = getSTable({ foldable: true })

    await wrapper.find('.s_table__groupRow--foldable').trigger('click')

    expect(wrapper.emitted('update:folded')?.[0]).toEqual([['admin']])
    expect(wrapper.text()).not.toContain('Bat')
  })

  test('shows a loading row while loading with no items yet', () => {
    const wrapper = getSTable({ items: [], loading: true })

    expect(wrapper.find('.s_table__row--loading').text()).toBe('Loading…')
    expect(wrapper.find('.s_table__row--noData').exists()).toBe(false)
  })

  test('uses loadingText for the loading row', () => {
    const wrapper = getSTable({ items: [], loading: true, loadingText: 'Fetching orders' })

    expect(wrapper.find('.s_table__row--loading').text()).toBe('Fetching orders')
  })

  test('keeps the rows and no loading row while reloading items', () => {
    const wrapper = getSTable({ loading: true })

    expect(wrapper.find('.s_table__row--loading').exists()).toBe(false)
    expect(wrapper.text()).toContain('Bat')
  })
})
