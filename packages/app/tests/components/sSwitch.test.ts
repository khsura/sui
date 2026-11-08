import { flushPromises } from '@vue/test-utils'
import { SSwitch } from '@/app/components'
import { mountWithApp, readElementStyleRule } from '@/app/tests/_helpers'

describe('SSwitch', () => {
  test('keeps a real, focusable switch input that is only visually hidden', () => {
    const wrapper = mountWithApp(SSwitch, { props: { label: 'Notifications' }, attachTo: document.body })
    const input = wrapper.find<HTMLInputElement>('input')

    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))

    input.element.focus()
    expect(document.activeElement).toBe(input.element)

    const inputRule = readElementStyleRule('sSwitch.vue', 'input')

    expect(inputRule).toContain('@include s_visuallyHidden')
    expect(inputRule).not.toMatch(/display:\s*none/)
  })

  test('toggles the model when the focused input is activated (Space)', async () => {
    const onUpdate = vi.fn()

    const wrapper = mountWithApp(SSwitch, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate },
      attachTo: document.body,
    })

    const input = wrapper.find<HTMLInputElement>('input')

    input.element.focus()
    // Space on a focused checkbox is the browser's click activation
    input.element.click()
    await flushPromises()

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenLastCalledWith(true)
  })

  test('a click on the visual button toggles exactly once', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountWithApp(SSwitch, { props: { modelValue: false, 'onUpdate:modelValue': onUpdate } })

    await wrapper.find('.s_switch__button').trigger('click')
    await flushPromises()

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenLastCalledWith(true)
  })

  test('a disabled switch is out of the Tab order and stays inert', async () => {
    const onUpdate = vi.fn()

    const wrapper = mountWithApp(SSwitch, {
      props: { modelValue: false, disabled: true, 'onUpdate:modelValue': onUpdate },
    })

    const input = wrapper.find<HTMLInputElement>('input')

    expect(input.element.disabled).toBe(true)

    input.element.click()
    await flushPromises()

    expect(onUpdate).not.toHaveBeenCalled()
    expect(input.element.checked).toBe(false)
  })

  test('a readonly switch ignores keyboard activation', async () => {
    const onUpdate = vi.fn()

    const wrapper = mountWithApp(SSwitch, {
      props: { modelValue: false, readonly: true, 'onUpdate:modelValue': onUpdate },
    })

    const input = wrapper.find<HTMLInputElement>('input')

    input.element.click()
    await flushPromises()

    expect(onUpdate).not.toHaveBeenCalled()
    expect(input.element.checked).toBe(false)
  })
})
