import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp, SRadio, SRadioGroup } from '@/app/components'

describe('SRadioGroup', () => {
  test('marks the radios when validation fails, even with hideError', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SApp, SRadio, SRadioGroup },
        setup: () => ({ rules: [(value: unknown) => value === 'b' || 'Pick b'] }),
        template: `
          <SApp>
            <SRadioGroup :rules="rules" hide-error>
              <SRadio value="a" label="A" />
              <SRadio value="b" label="B" />
            </SRadioGroup>
          </SApp>
        `,
      }),
    )

    await wrapper.find('input').trigger('click')
    await flushPromises()

    expect(wrapper.find('.s_radioGroup').classes()).toContain('s_radioGroup--error')
    expect(wrapper.find('.s_radioGroup').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('.s_formInputError').exists()).toBe(false)
  })

  test('keeps the option labels with hideDetails, which only removes the error area', () => {
    const wrapper = mount(
      defineComponent({
        components: { SApp, SRadio, SRadioGroup },
        template: `
          <SApp>
            <SRadioGroup hide-details>
              <SRadio value="free" label="Free" />
              <SRadio value="pro" label="Pro" />
            </SRadioGroup>
          </SApp>
        `,
      }),
    )

    const labels = wrapper.findAll('.s_radio__label')

    expect(labels.map((label) => label.text())).toEqual(['Free', 'Pro'])
    expect(labels.map((label) => label.attributes('style') ?? '')).not.toContain('display: none;')
    expect(wrapper.find('.s_formInputError').exists()).toBe(false)
  })
})
