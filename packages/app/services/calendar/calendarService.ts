import { datePickerModelFormats } from '@sui/app/configs'
import { type PropsCalendar } from '@sui/app/definitions'
import dayjs from '@sui/app/vendors/dayjs'
import { type ModelRef, computed } from 'vue'

export const useCalendarService = (props: PropsCalendar, focus: ModelRef<string | null | undefined>) => {
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
    next,
    prev,
    title,
  }
}
