import { flushPromises } from '@vue/test-utils'
import { SSelect } from '@/app/components'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SSelect', () => {
  test('marks the activator frame when validation fails, even with hideError', async () => {
    const requiredRule = (value: unknown) => !!value || 'Required'

    const wrapper = mountWithApp(SSelect, {
      props: { id: 'fruit', items: ['apple', 'banana'], rules: [requiredRule], hideError: true },
    })

    await wrapper.find('.s_select__activator').trigger('click')
    await flushPromises()

    expect(wrapper.find('.s_select__activator').classes()).toContain('s_select__activator--error')
    expect(wrapper.find('.s_formInputError').exists()).toBe(false)
  })

  test('does not repeat the label inside an empty field', () => {
    const wrapper = mountWithApp(SSelect, {
      props: { id: 'role', label: 'Role', items: ['admin', 'editor'] },
    })

    expect(wrapper.find('.s_select__label').text()).toBe('Role')
    expect(wrapper.find('.s_select__selectionText').text()).toBe('')
  })

  test('shows the placeholder while nothing is selected, and the selected text otherwise', () => {
    const props = { id: 'role', label: 'Role', placeholder: 'Choose a role', items: ['admin', 'editor'] }
    const empty = mountWithApp(SSelect, { props })
    const selected = mountWithApp(SSelect, { props: { ...props, modelValue: 'editor' } })

    expect(empty.find('.s_select__selectionText').text()).toBe('Choose a role')
    expect(empty.find('.s_select__selectionText').classes()).toContain('s_select__selectionText--placeholder')
    expect(selected.find('.s_select__selectionText').text()).toBe('editor')
    expect(selected.find('.s_select__selectionText').classes()).not.toContain('s_select__selectionText--placeholder')
  })

  test('sizes an empty field to its longest option with hidden copies of the options', () => {
    const wrapper = mountWithApp(SSelect, {
      props: { id: 'role', placeholder: 'Choose', items: ['Admin', { text: 'Editor', value: 'editor' }] },
    })

    const sizers = wrapper.findAll('.s_select__sizer')

    expect(sizers.map((sizer) => sizer.text())).toEqual(['Admin', 'Editor', 'Choose'])
    expect(sizers.every((sizer) => sizer.attributes('aria-hidden') === 'true')).toBe(true)
  })
})
