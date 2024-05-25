import { SSelect } from '@khsura/sui/components'
import { mount } from '@vue/test-utils'

describe('SSelect', () => {
  const component = mount(SSelect, {
    props: { label: '', id: 'id', modelValue: '' },
    global: {
      stubs: {
        Portal: true,
        PortalTarget: true,
      },
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
