import { type PropType } from 'vue'
import { datePickerModelFormats } from '@khsura/sui/configs/datePicker'
import { type CalendarEvent } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'

export const propsCalendar = () => {
  return {
    type: {
      type: String as PropType<'month' | 'week'>,
      default: 'month',
    },

    focus: {
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
