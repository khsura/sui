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
})
