import type { Meta } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { DatePickerType, SDatePicker, SDatePickerInput, datePickerModelFormats } from '@/app/index'
import { type PropsDatePickerInput } from '@/app/definitions'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const datePicker: Meta<typeof SDatePicker> = {
  title: 'UI Components/DatePicker',
  argTypes: {
    ...argTypesColor,
    type: {
      control: {
        type: 'select',
      },
      options: Object.values(DatePickerType),
    },
    width: {
      type: 'string',
    },
  },
}

export default datePicker

export const DatePicker = createStoryObj<typeof SDatePicker>({
  render: (args) => {
    return {
      components: {
        SDatePicker,
      },
      setup() {
        const date = ref(dayjs().format('YYYY-MM-DD'))

        return { args, date }
      },
      template: `
        <div style="display:flex;">
          <SDatePicker v-bind="args" v-model="date"></SDatePicker>
          <div class="s_pa__10">v-model: {{ date }}</div>
        </div>
      `,
    }
  },
  args: {
    type: 'date',
    dense: false,
    width: '280',
    hideTitle: false,
    min: dayjs().subtract(50, 'years').startOf('year').format(datePickerModelFormats.date),
    max: dayjs().endOf('year').format(datePickerModelFormats.date),
  },
})

const renderDatePickerInput = (args: Record<string, unknown>) => ({
  components: { SDatePickerInput },
  setup() {
    const date = ref<string | null>(dayjs().format('YYYY-MM-DD'))

    return { args, date }
  },
  template: `
    <div style="width: 280px; padding: 16px;">
      <SDatePickerInput v-bind="args" v-model="date" />
      <div class="s_pa__4" style="margin-top: 8px;">v-model: <span data-testid="model">{{ date }}</span></div>
    </div>
  `,
})

const getDatePickerInputElements = (canvasElement: HTMLElement) => {
  const input = canvasElement.querySelector<HTMLInputElement>('.s_datePickerInput__input')
  const model = canvasElement.querySelector<HTMLElement>('[data-testid="model"]')

  const [prevButton, nextButton] = Array.from(
    canvasElement.querySelectorAll<HTMLButtonElement>('.s_datePickerInput__carouselButton'),
  )

  if (!input || !model || !prevButton || !nextButton) {
    throw new Error('DatePickerInput elements not found')
  }

  return { input, model, prevButton, nextButton }
}

const datePickerInputArgs: Partial<PropsDatePickerInput> = {
  type: 'date',
  label: 'Date',
  dense: false,
  simple: false,
  tile: false,
  carousel: false,
  size: null,
  min: dayjs().subtract(50, 'years').startOf('year').format(datePickerModelFormats.date),
  max: dayjs().endOf('year').format(datePickerModelFormats.date),
}

export const DatePickerInput = createStoryObj<Meta>({
  render: renderDatePickerInput,
  args: datePickerInputArgs,
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    type: {
      control: { type: 'select' },
      options: Object.values(DatePickerType),
    },
    carousel: {
      control: {
        type: 'boolean',
      },
    },
  },
})

export const DatePickerInputCarousel = createStoryObj<Meta>({
  render: renderDatePickerInput,
  args: {
    ...datePickerInputArgs,
    carousel: true,
  },
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    type: {
      control: { type: 'select' },
      options: Object.values(DatePickerType),
    },
    carousel: {
      control: {
        type: 'boolean',
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const { input, model, prevButton, nextButton } = getDatePickerInputElements(canvasElement)
    const initialValue = input.value

    // the next button steps the value forward by one period
    await userEvent.click(nextButton)
    await expect(model).toHaveTextContent(dayjs(initialValue).add(1, 'day').format(datePickerModelFormats.date))

    // the previous button steps it back
    await userEvent.click(prevButton)
    await expect(model).toHaveTextContent(initialValue)
  },
})
