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

  describe('type="number" zero handling', () => {
    const mountNumber = (props: Record<string, unknown> = {}) =>
      mountWithApp(SInput, { props: { id: 'amount', type: 'number', ...props } })

    const lastModelValue = (wrapper: ReturnType<typeof mountNumber>) => {
      const events = wrapper.emitted('update:modelValue') as unknown[][] | undefined

      return events?.[events.length - 1]
    }

    const dispatchKeydown = (element: Element, key: string) => {
      const event = new KeyboardEvent('keydown', { key, cancelable: true })

      element.dispatchEvent(event)

      return event
    }

    test('accepts a lone 0 as a value', async () => {
      const wrapper = mountNumber()
      const input = wrapper.find('.s_input__input')

      await input.setValue('0')

      expect(lastModelValue(wrapper)).toEqual([0])
      expect((input.element as HTMLInputElement).value).toBe('0')
    })

    test('normalizes a leading zero (01 -> 1)', async () => {
      const wrapper = mountNumber()
      const input = wrapper.find('.s_input__input')

      await input.setValue('01')

      expect(lastModelValue(wrapper)).toEqual([1])
      expect((input.element as HTMLInputElement).value).toBe('1')
    })

    test('allows typing 0 into an empty field by default', () => {
      const wrapper = mountNumber()
      const event = dispatchKeydown(wrapper.find('.s_input__input').element, '0')

      expect(event.defaultPrevented).toBe(false)
    })

    test('blocks typing 0 into an empty field when positive', () => {
      const wrapper = mountNumber({ positive: true })
      const event = dispatchKeydown(wrapper.find('.s_input__input').element, '0')

      expect(event.defaultPrevented).toBe(true)
    })

    test('blocks typing 0 into an empty field when min > 0', () => {
      const wrapper = mountNumber({ min: 5 })
      const event = dispatchKeydown(wrapper.find('.s_input__input').element, '0')

      expect(event.defaultPrevented).toBe(true)
    })

    test('rejects a 0 value on input when positive', async () => {
      const wrapper = mountNumber({ positive: true })
      const input = wrapper.find('.s_input__input')

      await input.setValue('0')

      expect(lastModelValue(wrapper)).toEqual([null])
    })
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
