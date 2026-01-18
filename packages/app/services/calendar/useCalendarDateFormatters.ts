import type { CalendarDate } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useCalendarDateFormatters = () => {
  const weekdayFormatter = (day: CalendarDate, longWeekdays: boolean) => {
    return dayjs(day.date).format(longWeekdays ? 'dddd' : 'ddd')
  }

  const monthFormatter = (day: CalendarDate, short: boolean) => {
    return dayjs(day.date).format(short ? 'MMM' : 'MMMM')
  }

  const getDayLabel = (day: CalendarDate, showMonthOnFirst: boolean, shortMonths: boolean) => {
    const showMonth = day.day === 1 && showMonthOnFirst

    if (showMonth) {
      return `${monthFormatter(day, shortMonths)} ${day.day}`
    }

    return day.day.toString()
  }

  return {
    weekdayFormatter,
    monthFormatter,
    getDayLabel,
  }
}
