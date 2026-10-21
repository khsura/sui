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
})
