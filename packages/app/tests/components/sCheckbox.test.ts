import { flushPromises } from '@vue/test-utils'
import { SCheckbox } from '@/app/components'
import { mountWithApp, readElementStyleRule } from '@/app/tests/_helpers'

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

  describe('keyboard and screen reader access', () => {
    test('keeps a real, focusable checkbox input that is only visually hidden', () => {
      const wrapper = mountWithApp(SCheckbox, { props: { label: 'Agree' }, attachTo: document.body })
      const input = wrapper.find<HTMLInputElement>('input')

      expect(input.attributes('type')).toBe('checkbox')
      expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))

      input.element.focus()
      expect(document.activeElement).toBe(input.element)

      const inputRule = readElementStyleRule('form/sCheckbox.vue', 'input')

      expect(inputRule).toContain('@include s_visuallyHidden')
      expect(inputRule).not.toMatch(/display:\s*none/)
    })

    test('toggles the model when the focused input is activated (Space)', async () => {
      const onUpdate = vi.fn()

      const wrapper = mountWithApp(SCheckbox, {
        props: { modelValue: false, 'onUpdate:modelValue': onUpdate },
        attachTo: document.body,
      })

      const input = wrapper.find<HTMLInputElement>('input')

      input.element.focus()
      // Space on a focused checkbox is the browser's click activation
      input.element.click()
      await flushPromises()

      expect(onUpdate).toHaveBeenLastCalledWith(true)
    })

    test('a disabled checkbox is out of the Tab order and stays inert', async () => {
      const onUpdate = vi.fn()

      const wrapper = mountWithApp(SCheckbox, {
        props: { modelValue: false, disabled: true, 'onUpdate:modelValue': onUpdate },
      })

      const input = wrapper.find<HTMLInputElement>('input')

      expect(input.element.disabled).toBe(true)

      input.element.click()
      await flushPromises()

      expect(onUpdate).not.toHaveBeenCalled()
      expect(input.element.checked).toBe(false)
    })
  })
})
