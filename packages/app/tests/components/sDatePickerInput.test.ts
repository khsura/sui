import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { SDatePickerInput } from '@/app/components'
import { type PropsDatePickerInput } from '@/app/definitions'

const defaultProps: PropsDatePickerInput = {
  type: 'date',
  today: '2026-10-21',
  dateFormat: 'MMM D',
  monthFormat: 'MMMM',
  yearFormat: 'YYYY',
  label: 'Date',
  placeholder: null,
  simple: null,
  tile: false,
  carousel: false,
  disabled: false,
  readonly: false,
  max: '2026-12-31',
  min: '2026-01-01',
}

const getWrapper = (props: Partial<PropsDatePickerInput> = {}, modelValue: string | null = '2026-10-21') => {
  return mount(
    defineComponent({
      components: { SDatePickerInput },
      props: Object.keys(defaultProps) as (keyof PropsDatePickerInput)[],
      setup: () => {
        const model = ref<string | null>(modelValue)

        return { model }
      },
      template: `<SDatePickerInput v-bind="$props" v-model="model" />`,
    }),
    {
      props: { ...defaultProps, ...props },
    },
  )
}

describe('SDatePickerInput', () => {
  test('does not render the carousel buttons by default', () => {
    const wrapper = getWrapper()

    expect(wrapper.find('.s_datePickerInput__carouselButton').exists()).toBe(false)
  })

  test('renders the carousel buttons when the carousel prop is set', () => {
    const wrapper = getWrapper({ carousel: true })

    expect(wrapper.findAll('.s_datePickerInput__carouselButton')).toHaveLength(2)
  })

  test('steps the model value forward and backward on carousel click', async () => {
    const wrapper = getWrapper({ carousel: true })
    const [prevButton, nextButton] = wrapper.findAll('.s_datePickerInput__carouselButton')

    await nextButton.trigger('click')
    expect(wrapper.vm.model).toBe('2026-10-22')

    await prevButton.trigger('click')
    expect(wrapper.vm.model).toBe('2026-10-21')
  })

  test('disables the carousel buttons at the min and max bounds', () => {
    const wrapper = getWrapper({ carousel: true, min: '2026-10-21', max: '2026-10-21' })
    const [prevButton, nextButton] = wrapper.findAll('.s_datePickerInput__carouselButton')

    expect(prevButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  test('disables the carousel buttons when the input is disabled', () => {
    const wrapper = getWrapper({ carousel: true, disabled: true })
    const [prevButton, nextButton] = wrapper.findAll('.s_datePickerInput__carouselButton')

    expect(prevButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  test('converts the model value to the format of the current type', () => {
    const wrapper = getWrapper({ type: 'month' })

    expect(wrapper.vm.model).toBe('2026-10')
  })

  test('converts the model value when the type changes', async () => {
    const wrapper = getWrapper({ type: 'date' })

    expect(wrapper.vm.model).toBe('2026-10-21')

    await wrapper.setProps({ type: 'year' })
    expect(wrapper.vm.model).toBe('2026')
  })

  test('shows the value in the format of the current type', () => {
    const wrapper = getWrapper({ type: 'month' })

    expect(wrapper.find<HTMLInputElement>('.s_datePickerInput__input').element.value).toBe('2026-10')
  })

  test('reserves the width of the value in the input', () => {
    const wrapper = getWrapper({ type: 'date' })
    const input = wrapper.find<HTMLInputElement>('.s_datePickerInput__input')

    expect(input.attributes('size')).toBe('10')
  })

  test('reserves the width of the value in the input for the month type', () => {
    const wrapper = getWrapper({ type: 'month' })
    const input = wrapper.find<HTMLInputElement>('.s_datePickerInput__input')

    expect(input.attributes('size')).toBe('7')
  })

  test('stretches to the width of the container by default', () => {
    const wrapper = getWrapper()

    expect(wrapper.find('.s_datePickerInput').classes()).toContain('s_datePickerInput--block')
  })

  test('does not stretch when the block prop is disabled', () => {
    const wrapper = getWrapper({ block: false })

    expect(wrapper.find('.s_datePickerInput').classes()).not.toContain('s_datePickerInput--block')
  })
})
