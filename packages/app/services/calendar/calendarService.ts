import { datePickerModelFormats } from '@sui/app/configs'
import { type PropsCalendar } from '@sui/app/definitions'
import { getCalendarDate } from '@sui/app/repositories'
import { type CalendarEmitEvents } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'
import { computed } from 'vue'
import { useModelService } from '../core'

export const useCalendarService = (props: PropsCalendar, emit: CalendarEmitEvents) => {
  const focus = useModelService(props, emit, 'modelValue', {
    formatter(v) {
      return dayjs(v).isValid() ? v : dayjs().format(datePickerModelFormats.date)
    },
    onChange: (value) => {
      const start = getCalendarDate(dayjs(value || undefined).startOf('month'))
      const end = getCalendarDate(dayjs(value || undefined).endOf('month'))

      emit('change', { start, end })
    },
  })

  const next = (value = 1) => {
    focus.value = dayjs(focus.value).add(value, props.type).format(datePickerModelFormats.date)
  }

  const prev = (value = 1) => {
    focus.value = dayjs(focus.value).subtract(value, props.type).format(datePickerModelFormats.date)
  }

  const title = computed(() => {
    return dayjs(focus.value).format('YYYY年M月')
  })

  return {
    focus,
    next,
    prev,
    title,
  }
}
