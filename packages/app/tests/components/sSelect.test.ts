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

  test('is a focusable combobox named by its label', () => {
    const wrapper = mountWithApp(SSelect, { props: { id: 'role', label: 'Role', items: ['admin', 'editor'] } })
    const combobox = wrapper.find('[role="combobox"]')
    const labelId = wrapper.find('.s_select__label').attributes('id')

    expect(combobox.attributes('tabindex')).toBe('0')
    expect(combobox.attributes('aria-haspopup')).toBe('listbox')
    expect(combobox.attributes('aria-expanded')).toBe('false')
    expect(labelId).toBeTruthy()
    expect(combobox.attributes('aria-labelledby')).toBe(labelId)
  })

  test('takes ariaLabel as its name when there is no label, and leaves the Tab order when disabled', () => {
    const wrapper = mountWithApp(SSelect, { props: { ariaLabel: 'Items per page', items: ['10'], disabled: true } })
    const combobox = wrapper.find('[role="combobox"]')

    expect(combobox.attributes('aria-label')).toBe('Items per page')
    expect(combobox.attributes('tabindex')).toBe('-1')
    expect(combobox.attributes('aria-disabled')).toBe('true')
  })

  test('opens with the keyboard, moves the highlight past disabled options and picks with Enter', async () => {
    const items = ['apple', { text: 'Banana', value: 'banana', disabled: true }, 'cherry']
    const wrapper = mountWithApp(SSelect, { props: { id: 'fruit', items }, attachTo: document.body })
    const combobox = wrapper.find('[role="combobox"]')

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    expect(combobox.attributes('aria-expanded')).toBe('true')
    expect(combobox.attributes('aria-activedescendant')).toBe('fruit-option-0')

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    expect(combobox.attributes('aria-activedescendant')).toBe('fruit-option-2')

    await combobox.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toContainEqual(['cherry'])
    expect(combobox.attributes('aria-expanded')).toBe('false')
  })

  test('closes on Escape without picking an option', async () => {
    const wrapper = mountWithApp(SSelect, {
      props: { id: 'fruit', items: ['apple', 'cherry'] },
      attachTo: document.body,
    })

    const combobox = wrapper.find('[role="combobox"]')

    await combobox.trigger('keydown', { key: ' ' })
    expect(combobox.attributes('aria-expanded')).toBe('true')

    await combobox.trigger('keydown', { key: 'Escape' })

    expect(combobox.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('marks the combobox invalid and points it at the error message', async () => {
    const requiredRule = (value: unknown) => !!value || 'Required'
    const wrapper = mountWithApp(SSelect, { props: { id: 'fruit', items: ['apple'], rules: [requiredRule] } })

    await wrapper.find('.s_select__activator').trigger('click')
    await flushPromises()

    const combobox = wrapper.find('[role="combobox"]')

    expect(combobox.attributes('aria-invalid')).toBe('true')
    expect(combobox.attributes('aria-describedby')).toBe('fruit-error')
    expect(wrapper.find('#fruit-error').text()).toBe('Required')
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
