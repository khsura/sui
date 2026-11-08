import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { SApp, SRadio, SRadioGroup } from '@/app/components'
import { readElementStyleRule } from '@/app/tests/_helpers'

const mountGroup = (groupDisabled = false) => {
  const selected = ref<string | undefined>()

  const wrapper = mount(
    defineComponent({
      components: { SApp, SRadio, SRadioGroup },
      setup: () => ({ selected, groupDisabled }),
      template: `
        <SApp>
          <SRadioGroup v-model="selected" name="letter" :disabled="groupDisabled">
            <SRadio value="a" label="A" />
            <SRadio value="b" label="B" />
          </SRadioGroup>
        </SApp>
      `,
    }),
    { attachTo: document.body },
  )

  return { wrapper, selected }
}

describe('SRadio', () => {
  test('keeps a real radio input as the single Tab stop, only visually hidden', () => {
    const { wrapper } = mountGroup()
    const input = wrapper.find<HTMLInputElement>('input')

    expect(input.attributes('type')).toBe('radio')
    expect(input.attributes('name')).toBe('letter')
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))
    expect(wrapper.find('button').attributes('tabindex')).toBe('-1')

    input.element.focus()
    expect(document.activeElement).toBe(input.element)

    const inputRule = readElementStyleRule('form/radio/sRadio.vue', 'input')

    expect(inputRule).toContain('@include s_visuallyHidden')
    expect(inputRule).not.toMatch(/display:\s*none/)

    wrapper.unmount()
  })

  test('selects the value when the focused input is activated (Space)', async () => {
    const { wrapper, selected } = mountGroup()
    const input = wrapper.findAll<HTMLInputElement>('input')[1]

    input.element.focus()
    // Space on a focused radio is the browser's click activation; it bubbles to the button
    input.element.click()
    await flushPromises()

    expect(selected.value).toBe('b')
    expect(input.element.checked).toBe(true)
    wrapper.unmount()
  })

  test('a disabled radio is out of the Tab order and stays inert', async () => {
    const { wrapper, selected } = mountGroup(true)
    const input = wrapper.find<HTMLInputElement>('input')

    expect(input.element.disabled).toBe(true)

    input.element.click()
    await flushPromises()

    expect(selected.value).toBeUndefined()
    wrapper.unmount()
  })
})
