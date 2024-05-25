import { SDatePicker } from '@khsura/sui/components'
import { datePickerModelFormats } from '@khsura/sui/configs/datePicker'
import { argTypesColor } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'
import dayjs from 'dayjs'
import { ref } from 'vue'
import type { Meta } from '@storybook/vue3'

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
