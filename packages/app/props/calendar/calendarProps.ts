import { type PropType } from 'vue'
import { datePickerModelFormats } from '~/configs/datePicker'
import { type CalendarEvent } from '~/types'
import dayjs from '~/vendors/dayjs'

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
