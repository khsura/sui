import { computed } from 'vue'
import { filterEventsForDate, processCalendarEvent, sortEvents } from './calendarEventService'
import { type PropsCalendarMonthly } from '@/app/definitions'
import { getCalendarDate } from '@/app/repositories/calendarRepository'
import { useColorRepository } from '@/app/repositories/colorRepository'
import { type CalendarDate, type CalendarEvent, type CalendarEventExtended } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useCalendarMonthlyService = <T extends CalendarEvent>(props: PropsCalendarMonthly<T>) => {
  const today = dayjs()
  const eventPadding = 4
  const { getBackgroundColorAttributes } = useColorRepository()

  const date = computed(() => {
    return dayjs(props.focus)
  })

  const startDateOfMonth = computed(() => {
    const startOfMonth = date.value.startOf('month')

    return startOfMonth.subtract(startOfMonth.day(), 'days')
  })

  const endDateOfMonth = computed(() => {
    const endOfMonth = date.value.endOf('month')

    return endOfMonth.add(7 - endOfMonth.day(), 'days')
  })

  const days = dayjs.weekdaysShort()

  const dates = computed(() => {
    const days = endDateOfMonth.value.diff(startDateOfMonth.value, 'day')

    const dates = Array(days)
      .fill(0)
      .map<{
        value: string
        isToday: boolean
        isThisMonth: boolean
        events: Array<CalendarEventExtended<T>>
        date: CalendarDate
      }>((_, i) => {
        const target = startDateOfMonth.value.add(i, 'days')
        const filteredEvents = filterEventsForDate(props.events, target)

        const events = sortEvents(
          filteredEvents.map((event, id) =>
            processCalendarEvent({
              target,
              event,
              eventId: id,
              eventColor: props.eventColor,
              isWeekly: false,
              getBackgroundColorAttributes,
            }),
          ),
        )

        return {
          isToday: today.isSame(target, 'day'),
          isThisMonth: date.value.isSame(target, 'month'),
          value: target.date().toString(),
          events,
          date: getCalendarDate(target),
        }
      })

    return dates
  })

  return {
    days,
    eventPadding: `${eventPadding}px`,
    dates,
  }
}
