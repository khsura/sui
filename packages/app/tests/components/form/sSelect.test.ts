import { SSelect } from '@sui/app/components'
import { mount } from '@vue/test-utils'
import portalVue from 'portal-vue'

describe('SSelect', () => {
  const component = mount(SSelect, {
    props: { label: '', id: 'id', modelValue: '' },
    global: {
      plugins: [portalVue],
    },
  })

  test('formError will be displayed if hideDetails is false', async () => {
    await component.setProps({ hideDetails: false })
    expect(component.find('.s_formInputError').exists()).toBe(true)
  })

  test('formError will be hidden if hideDetails is true', async () => {
    await component.setProps({ hideDetails: true })
    expect(component.find('.s_formInputError').exists()).toBe(false)
  })
})
