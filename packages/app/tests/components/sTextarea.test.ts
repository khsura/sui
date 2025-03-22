import { mount } from '@vue/test-utils'
import { STextarea } from '@khsura/sui/components'

describe('STextarea', () => {
  test('renders correctly', () => {
    const wrapper = mount(STextarea, { props: { id: 'textarea' } })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('attributes can be set properly', async () => {
    const wrapper = mount(STextarea, { props: { id: 'textarea' } })

    await wrapper.setProps({
      id: 'textarea',
      cols: 4,
      rows: 10,
      ariaLabelledby: 'hello',
      disabled: false,
    })

    expect(wrapper.find('.s_textarea__input').attributes().cols).toBe('4')
    expect(wrapper.find('.s_textarea__input').attributes().rows).toBe('10')
    expect(wrapper.find('.s_textarea__input').attributes()['aria-labelledby']).toBe('hello')
    expect(wrapper.find('.s_textarea__input').attributes().disabled).toBeUndefined()
    expect(wrapper.find('.s_textarea__input').attributes().maxlength).toBeUndefined()

    await wrapper.setProps({ disabled: true })

    expect(wrapper.find('.s_textarea__input').attributes().disabled).toBeDefined()
  })

  test('all attributes can be set properly', () => {
    const wrapper = mount(STextarea, {
      props: {
        id: 'textarea',
        name: 'textarea',
        ariaLabelledby: 'label',
        disabled: true,
        maxlength: 100,
        readonly: true,
        placeholder: 'placeholder',
        spellcheck: true,
      },
    })

    expect(wrapper.find('.s_textarea__input').attributes()).toStrictEqual({
      class: 's_textarea__input s_textarea--resize__none',
      id: 'textarea',
      name: 'textarea',
      'aria-labelledby': 'label',
      rows: '2',
      cols: '20',
      disabled: '',
      maxlength: '100',
      readonly: '',
      placeholder: 'placeholder',
      spellcheck: 'true',
    })
  })

  test('resize can be set properly', async () => {
    const wrapper = mount(STextarea, { props: { id: 'textarea' } })

    await wrapper.setProps({ resize: true })

    expect(wrapper.find('.s_textarea__input').classes()).not.contain('s_textarea--resize__none')
  })
})
