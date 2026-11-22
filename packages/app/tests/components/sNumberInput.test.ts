import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { SApp, SForm, SFormRow, SNumberInput } from '@/app/components'
import { type PropsNumberInput } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SNumberInput', () => {
  const getSNumberInput = (props?: Partial<PropsNumberInput> & { modelValue?: number | null }) => {
    return mountWithApp(SNumberInput, { props: { id: 'amount', ...props } })
  }

  const getEmittedValues = (wrapper: ReturnType<typeof getSNumberInput>) =>
    (wrapper.emitted('update:modelValue') ?? []).map(([value]) => value)

  const typeText = async (wrapper: ReturnType<typeof getSNumberInput>, text: string) => {
    const input = wrapper.find('input')

    await input.setValue(text)
    await flushPromises()
  }

  describe('rendering', () => {
    test('renders the root class and a text field with spinbutton semantics', () => {
      const wrapper = getSNumberInput({ min: 0, max: 10, modelValue: 4 })
      const input = wrapper.find('input')

      expect(wrapper.find('.s_numberInput').exists()).toBe(true)
      expect(input.attributes('type')).toBe('text')
      expect(input.attributes('role')).toBe('spinbutton')
      expect(input.attributes('aria-valuemin')).toBe('0')
      expect(input.attributes('aria-valuemax')).toBe('10')
      expect(input.attributes('aria-valuenow')).toBe('4')
    })

    test('never renders native min, max or step attributes, so no browser validation bubble appears', () => {
      const input = getSNumberInput({ min: 1, max: 5, step: 2 }).find('input')

      expect(input.attributes('min')).toBeUndefined()
      expect(input.attributes('max')).toBeUndefined()
      expect(input.attributes('step')).toBeUndefined()
    })

    test('leaves out aria-valuenow while the field is empty', () => {
      expect(getSNumberInput().find('input').attributes('aria-valuenow')).toBeUndefined()
    })

    test.each([
      [{ min: 0 }, 'numeric'],
      [{ min: 0, precision: 2 }, 'decimal'],
      [{}, 'text'],
      [{ min: -10 }, 'text'],
    ])('picks the phone keyboard for %o: %s', (props, inputmode) => {
      expect(getSNumberInput(props).find('input').attributes('inputmode')).toBe(inputmode)
    })

    test('shows 0 and a value equal to min', () => {
      expect(getSNumberInput({ modelValue: 0 }).find('input').element.value).toBe('0')
      expect(getSNumberInput({ min: 1, modelValue: 1 }).find('input').element.value).toBe('1')
    })

    test('shows the fixed number of decimals of precision', () => {
      expect(getSNumberInput({ precision: 2, modelValue: 5 }).find('input').element.value).toBe('5.00')
    })

    test('shows the label, prefix and suffix', () => {
      const wrapper = getSNumberInput({ label: 'Price', prefix: '₮', suffix: 'per item' })

      expect(wrapper.find('label').text()).toBe('Price')
      expect(wrapper.find('label').attributes('for')).toBe('amount')
      expect(wrapper.find('.s_numberInput__affix--prefix').text()).toBe('₮')
      expect(wrapper.find('.s_numberInput__affix--suffix').text()).toBe('per item')
    })

    test('turns a hidden label into the aria-label with hideDetails', () => {
      const wrapper = getSNumberInput({ label: 'Quantity', hideDetails: true })

      expect(wrapper.find('label').attributes('style')).toContain('display: none')
      expect(wrapper.find('input').attributes('aria-label')).toBe('Quantity')
    })

    test('adds the size, dense, tile and textRight modifiers', () => {
      const root = getSNumberInput({ size: 'large', dense: true, tile: true, textRight: true }).find('.s_numberInput')

      expect(root.classes()).toEqual(
        expect.arrayContaining([
          's_numberInput--size__large',
          's_numberInput--dense',
          's_numberInput--tile',
          's_numberInput--textRight',
        ]),
      )
    })
  })

  describe('controls', () => {
    test('stacks labelled increment and decrement buttons by default, out of the tab order', () => {
      const wrapper = getSNumberInput()
      const buttons = wrapper.findAll('.s_numberInput__stack button')

      expect(buttons.map((button) => button.attributes('aria-label'))).toEqual(['Increase', 'Decrease'])
      expect(buttons.every((button) => button.attributes('tabindex') === '-1')).toBe(true)
      expect(buttons.every((button) => button.attributes('aria-controls') === 'amount')).toBe(true)
    })

    test('puts minus first and plus last with controlVariant="split"', () => {
      const wrapper = getSNumberInput({
        controlVariant: 'split',
        decrementAriaLabel: 'Less',
        incrementAriaLabel: 'More',
      })

      const children = wrapper.find('.s_numberInput__field').element.children

      expect(wrapper.find('.s_numberInput__stack').exists()).toBe(false)
      expect(children[0]?.getAttribute('aria-label')).toBe('Less')
      expect(children[children.length - 1]?.getAttribute('aria-label')).toBe('More')
    })

    test('hides both buttons with hideControls', () => {
      expect(getSNumberInput({ hideControls: true }).findAll('button')).toHaveLength(0)
    })

    test('steps the value by step and rounds away binary noise', async () => {
      const wrapper = getSNumberInput({ modelValue: 0.1, step: 0.2, precision: null })

      await wrapper.find('.s_numberInput__control--increment').trigger('click')
      await flushPromises()

      expect(getEmittedValues(wrapper)).toEqual([0.3])
    })

    test('starts an empty field at 0, or at the nearest bound', async () => {
      const empty = getSNumberInput()
      const bounded = getSNumberInput({ min: 5 })

      await empty.find('.s_numberInput__control--increment').trigger('click')
      await bounded.find('.s_numberInput__control--increment').trigger('click')
      await flushPromises()

      expect(getEmittedValues(empty)).toEqual([0])
      expect(getEmittedValues(bounded)).toEqual([5])
    })

    test('disables the buttons at the bounds', () => {
      const atMax = getSNumberInput({ min: 0, max: 3, modelValue: 3 })
      const atMin = getSNumberInput({ min: 0, max: 3, modelValue: 0 })

      expect(atMax.find('.s_numberInput__control--increment').attributes('disabled')).toBeDefined()
      expect(atMax.find('.s_numberInput__control--decrement').attributes('disabled')).toBeUndefined()
      expect(atMin.find('.s_numberInput__control--decrement').attributes('disabled')).toBeDefined()
    })

    test('disables the buttons when the field is disabled or read-only', () => {
      for (const props of [{ disabled: true }, { readonly: true }]) {
        const buttons = getSNumberInput({ ...props, modelValue: 1 }).findAll('button')

        expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true)
      }
    })

    test('clamps a step past a bound to the bound', async () => {
      const wrapper = getSNumberInput({ max: 10, step: 5, modelValue: 8 })

      await wrapper.find('.s_numberInput__control--increment').trigger('click')
      await flushPromises()

      expect(getEmittedValues(wrapper)).toEqual([10])
    })
  })

  describe('keyboard', () => {
    test('ArrowUp and ArrowDown step the value and keep the caret still', async () => {
      const wrapper = getSNumberInput({ modelValue: 5, step: 2 })
      const input = wrapper.find('input')

      await input.trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await flushPromises()

      expect(getEmittedValues(wrapper)).toEqual([7, 5])
      expect(wrapper.emitted('keydown')).toHaveLength(2)
    })

    test('ArrowUp does nothing at max', async () => {
      const wrapper = getSNumberInput({ max: 5, modelValue: 5 })

      await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()

      expect(getEmittedValues(wrapper)).toEqual([])
    })
  })

  describe('typing', () => {
    test('emits the number typed, and null for an empty field', async () => {
      const wrapper = getSNumberInput({ modelValue: 3 })

      await typeText(wrapper, '42')
      await typeText(wrapper, '')

      expect(getEmittedValues(wrapper)).toEqual([42, null])
    })

    test('accepts a typed 0', async () => {
      const wrapper = getSNumberInput({ min: 0 })

      await typeText(wrapper, '0')

      expect(getEmittedValues(wrapper)).toEqual([0])
    })

    test('refuses letters, a decimal point with precision 0 and a minus sign when min is not negative', async () => {
      const wrapper = getSNumberInput({ min: 0, modelValue: 1 })

      for (const text of ['1a', '1.5', '-1']) {
        await typeText(wrapper, text)

        expect(wrapper.find('input').element.value).toBe('1')
      }

      expect(getEmittedValues(wrapper)).toEqual([])
    })

    test('keeps unfinished decimals such as "1." while typing', async () => {
      const wrapper = getSNumberInput({ precision: 2 })

      await typeText(wrapper, '1.')
      await typeText(wrapper, '1.0')
      await typeText(wrapper, '1.05')

      expect(wrapper.find('input').element.value).toBe('1.05')
      expect(getEmittedValues(wrapper)).toEqual([1, 1.05])
    })

    test('refuses more decimals than precision', async () => {
      const wrapper = getSNumberInput({ precision: 2 })

      await typeText(wrapper, '1.25')
      await typeText(wrapper, '1.255')

      expect(wrapper.find('input').element.value).toBe('1.25')
    })

    test('accepts a negative number when min allows it', async () => {
      const wrapper = getSNumberInput({ min: -5 })

      await typeText(wrapper, '-')
      await typeText(wrapper, '-3')

      expect(getEmittedValues(wrapper)).toEqual([-3])
    })
  })

  describe('blur', () => {
    test('clamps a typed value into min and max', async () => {
      const wrapper = getSNumberInput({ min: 1, max: 10 })
      const input = wrapper.find('input')

      await typeText(wrapper, '50')
      await input.trigger('blur')
      await flushPromises()

      expect(input.element.value).toBe('10')
      expect(getEmittedValues(wrapper)).toEqual([50, 10])
    })

    test('raises a value below min to min', async () => {
      const wrapper = getSNumberInput({ min: 1 })
      const input = wrapper.find('input')

      await typeText(wrapper, '0')
      await input.trigger('blur')
      await flushPromises()

      expect(getEmittedValues(wrapper)).toEqual([0, 1])
    })

    test('formats the decimals of precision', async () => {
      const wrapper = getSNumberInput({ precision: 2 })
      const input = wrapper.find('input')

      await typeText(wrapper, '3.5')
      await input.trigger('blur')
      await flushPromises()

      expect(input.element.value).toBe('3.50')
    })

    test('emits focus and blur', async () => {
      const wrapper = getSNumberInput()
      const input = wrapper.find('input')

      await input.trigger('focus')
      await input.trigger('blur')
      await flushPromises()

      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })

  describe('validation', () => {
    const minimumRule = (value?: unknown) => (typeof value === 'number' && value >= 1) || 'At least 1'

    test('runs the rules with the number, shows the message and links it with aria-describedby', async () => {
      const wrapper = getSNumberInput({ rules: [minimumRule] })
      const input = wrapper.find('input')

      await typeText(wrapper, '0')

      expect(wrapper.find('.s_formInputError').text()).toContain('At least 1')
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('amount-error')
      expect(wrapper.find('.s_numberInput__field--error').exists()).toBe(true)
    })

    test('keeps the error frame but drops the message with hideError', async () => {
      const wrapper = getSNumberInput({ rules: [minimumRule], hideError: true })

      await typeText(wrapper, '0')

      expect(wrapper.find('.s_formInputError').exists()).toBe(false)
      expect(wrapper.find('.s_numberInput__field--error').exists()).toBe(true)
    })

    test('is validated by SForm.validate() with its number value', async () => {
      const wrapper = mount(
        defineComponent({
          components: { SApp, SForm, SNumberInput },
          setup() {
            const form = ref<InstanceType<typeof SForm> | null>(null)
            const quantity = ref<number | null>(0)

            return { form, quantity, rules: [minimumRule] }
          },
          template: `<SApp><SForm ref="form"><SNumberInput id="qty" v-model="quantity" :rules="rules" /></SForm></SApp>`,
        }),
      )

      const form = wrapper.findComponent(SForm)

      form.vm.validate()
      await flushPromises()

      expect(wrapper.find('.s_formInputError').text()).toContain('At least 1')
    })
  })

  describe('in SFormRow', () => {
    test('marks itself as a field with a label and details line', () => {
      const wrapper = mount(
        defineComponent({
          components: { SApp, SFormRow, SNumberInput },
          template: `<SApp><SFormRow><SNumberInput label="Qty" /></SFormRow></SApp>`,
        }),
      )

      expect(wrapper.find('.s_formRow > .s_numberInput').classes()).toEqual(
        expect.arrayContaining(['s_field', 's_field--labelled', 's_field--details']),
      )
    })
  })

  test('replaces the text when v-model changes from outside', async () => {
    const quantity = ref<number | null>(1)

    const wrapper = mount(
      defineComponent({
        components: { SApp, SNumberInput },
        setup: () => ({ quantity }),
        template: `<SApp><SNumberInput v-model="quantity" /></SApp>`,
      }),
    )

    quantity.value = 9
    await flushPromises()

    expect(wrapper.find('input').element.value).toBe('9')
  })
})
