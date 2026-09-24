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

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('.s_radioGroup').classes()).toContain('s_radioGroup--error')
    expect(wrapper.find('.s_formInputError').exists()).toBe(false)
  })
})
