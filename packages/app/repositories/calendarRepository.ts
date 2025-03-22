import { type ConfigType } from 'dayjs'
import { type CalendarDate } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'

export const getCalendarDate = (value: ConfigType): CalendarDate => {
  const date = dayjs(value)
  const today = dayjs()
  const { years: year, months: month, date: day, hours: hour, minutes: minute } = date.toObject()

  return {
    date: date.format('YYYY-MM-DD'),
    time: date.format('HH:mm'),
    year,
    month,
    day,
    hour,
    minute,
    weekday: date.day(),
    // hasDay
    // hasTime
    past: date.isBefore(today, 'date'),
    present: date.isSame(today, 'date'),
    future: date.isAfter(today, 'date'),
  }
}
