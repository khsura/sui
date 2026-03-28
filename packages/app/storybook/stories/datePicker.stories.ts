import type { Meta } from '@storybook/vue3-vite'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { SDatePicker, SDatePickerInput, datePickerModelFormats } from '@/app/index'
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
      options: ['date', 'month'],
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

export const DatePickerInput = createStoryObj<typeof SDatePickerInput>({
  render: (args) => {
    return {
      components: { SDatePickerInput },
      setup() {
        const date = ref<string | null>(dayjs().format('YYYY-MM-DD'))

        return { args, date }
      },
      template: `
        <div style="width: 280px; padding: 16px;">
          <SDatePickerInput v-bind="args" v-model="date" />
          <div class="s_pa__4" style="margin-top: 8px;">v-model: {{ date }}</div>
        </div>
      `,
    }
  },
  args: {
    type: 'date',
    label: 'Date',
    dense: false,
    simple: false,
    tile: false,
    size: null,
    min: dayjs().subtract(50, 'years').startOf('year').format(datePickerModelFormats.date),
    max: dayjs().endOf('year').format(datePickerModelFormats.date),
  },
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    type: {
      control: { type: 'select' },
      options: ['date', 'month'],
    },
  },
})
