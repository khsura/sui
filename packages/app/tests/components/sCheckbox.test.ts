import { flushPromises } from '@vue/test-utils'
import { SCheckbox } from '@/app/components'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SCheckbox', () => {
  const requiredRule = (value: unknown) => value === true || 'Required'

  test('marks the checkbox when validation fails, even with hideError', async () => {
    const wrapper = mountWithApp(SCheckbox, { props: { id: 'agree', rules: [requiredRule], hideError: true } })
    const checkbox = wrapper.find('.s_checkbox__input')

    expect(wrapper.classes()).not.toContain('s_checkbox--error')

    await checkbox.setValue(true)
    await checkbox.setValue(false)
    await flushPromises()

    expect(wrapper.classes()).toContain('s_checkbox--error')
    expect(wrapper.find('.s_formInputError').exists()).toBe(false)
  })

  test('does not mark the checkbox when disabled', async () => {
    const wrapper = mountWithApp(SCheckbox, { props: { id: 'agree', rules: [requiredRule], disabled: true } })

    await wrapper.find('.s_checkbox__input').trigger('input')
    await flushPromises()

    expect(wrapper.classes()).not.toContain('s_checkbox--error')
  })
})
