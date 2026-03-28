import { type ModelRef, computed } from 'vue'
import { datePickerModelFormats } from '@/app/configs'
import { type PropsCalendar } from '@/app/definitions'
import dayjs from '@/app/vendors/dayjs'
import type { CalendarEvent, CalendarType } from '@/app/types'

export const useCalendarService = <T extends CalendarEvent>(
  props: PropsCalendar<T>,
  focus: ModelRef<string | null | undefined>,
) => {
  const calendarType: CalendarType = props.type ?? 'month'

  const navigate = (direction: 1 | -1, value = 1) => {
    const currentDate = dayjs(focus.value)
    const targetDate = currentDate.add(direction * value, calendarType)

    focus.value = targetDate.format(datePickerModelFormats.date)
  }

  const next = (value = 1) => {
    navigate(1, value)
  }

  const prev = (value = 1) => {
    navigate(-1, value)
  }

  const title = computed(() => {
    if (calendarType === 'week') {
      const start = dayjs(focus.value).startOf('week')
      const end = dayjs(focus.value).endOf('week')

      if (start.month() === end.month()) {
        return `${start.format('YYYY年M月')} ${start.date()}日 - ${end.date()}日`
      }

      return `${start.format('YYYY年M月D日')} - ${end.format('YYYY年M月D日')}`
    }

    return dayjs(focus.value).format('YYYY年M月')
  })

  return {
    next,
    prev,
    title,
  }
}
