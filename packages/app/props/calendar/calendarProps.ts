import { datePickerModelFormats } from '@sui/app/configs/datePicker'
import { type CalendarEvent } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'
import { type PropType } from 'vue'

export const propsCalendar = () => {
  return {
    type: {
      type: String as PropType<'month' | 'week'>,
      default: 'month',
    },
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: {
      type: String as PropType<string>,
      default: dayjs().format(datePickerModelFormats.date),
    },
    events: {
      type: Array as PropType<CalendarEvent[]>,
      default: () => [],
    },
    eventColor: {
      type: Function as PropType<((event: CalendarEvent) => string) | undefined>,
      default: undefined,
    },
  }
}
