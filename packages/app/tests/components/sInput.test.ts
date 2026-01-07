import { SInput } from '@/app/components'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SInput', () => {
  test('renders correctly', () => {
    const wrapper = mountWithApp(SInput, { props: { id: 'password' } })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('attributes can be set properly', () => {
    const wrapper = mountWithApp(SInput, {
      props: { id: 'password', max: 16, ariaLabelledby: 'hello', disabled: false, maxlength: null, type: 'number' },
    })

    expect(wrapper.find('.s_input__input').attributes().max).toBe('16')
    expect(wrapper.find('.s_input__input').attributes()['aria-labelledby']).toBe('hello')
    expect(wrapper.find('.s_input__input').attributes().disabled).toBeUndefined()
    expect(wrapper.find('.s_input__input').attributes().maxlength).toBeUndefined()
  })

  test('disabled attribute can be set properly', () => {
    const wrapper = mountWithApp(SInput, { props: { id: 'password', disabled: true } })

    expect(wrapper.find('.s_input__input').attributes().disabled).toBeDefined()
  })

  test('all attributes can be set properly', () => {
    const wrapper = mountWithApp(SInput, {
      props: {
        id: 'password',
        name: 'password',
        ariaLabelledby: 'label',
        disabled: true,
        max: 100,
        min: 1,
        maxlength: 100,
        readonly: true,
        placeholder: 'placeholder',
        spellcheck: true,
        type: 'number',
        simple: true,
      },
    })

    expect(wrapper.find('.s_input__input').attributes()).toStrictEqual({
      class: 's_input__input s_input__input--simple',
      id: 'password',
      name: 'password',
      'aria-labelledby': 'label',
      disabled: '',
      max: '100',
      min: '1',
      maxlength: '100',
      readonly: '',
      placeholder: 'placeholder',
      spellcheck: 'true',
      type: 'number',
    })
  })
})
