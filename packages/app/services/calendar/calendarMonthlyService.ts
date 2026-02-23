import { computed } from 'vue'
import {
  type CalendarEventExtended,
  filterEventsForDate,
  processCalendarEvent,
  sortEvents,
} from './calendarEventService'
import { type PropsCalendarMonthly } from '@/app/definitions'
import { getCalendarDate } from '@/app/repositories/calendarRepository'
import { useColorRepository } from '@/app/repositories/colorRepository'
import { type CalendarDate } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useCalendarMonthlyService = (props: PropsCalendarMonthly) => {
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
        events: Array<CalendarEventExtended | null>
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

    dates.forEach((date, i) => {
      const previousDate = i > 0 ? dates[i - 1] : undefined
      const events: Array<CalendarEventExtended | null> = Array(date.events.length).fill(null)

      const eventsData = date.events.map((event) => {
        const indexOfPreviousDate =
          previousDate?.events.findIndex((previousEvent) => previousEvent?.id === event?.id) ?? -1

        return {
          event: event ? { ...event } : null,
          indexOfPreviousDate,
        }
      })

      eventsData.forEach(({ event, indexOfPreviousDate }) => {
        if (indexOfPreviousDate > -1) {
          events[indexOfPreviousDate] = event
        }
      })

      eventsData.forEach(({ event, indexOfPreviousDate }) => {
        if (indexOfPreviousDate === -1) {
          events[events.indexOf(null)] = event
        }
      })

      dates[i] = {
        ...date,
        events,
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
