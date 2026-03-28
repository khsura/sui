import { computed } from 'vue'
import { filterEventsForDate, processCalendarEvent, sortEvents } from './calendarEventService'
import { type PropsCalendarWeekly } from '@/app/definitions'
import { getCalendarDate } from '@/app/repositories/calendarRepository'
import { useColorRepository } from '@/app/repositories/colorRepository'
import { type CalendarDate, type CalendarEvent, type CalendarEventExtended } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useCalendarWeeklyService = <T extends CalendarEvent>(props: PropsCalendarWeekly<T>) => {
  const today = dayjs()
  const { getBackgroundColorAttributes } = useColorRepository()

  const date = computed(() => {
    return dayjs(props.focus)
  })

  const startOfWeek = computed(() => {
    return date.value.startOf('week')
  })

  const endOfWeek = computed(() => {
    return date.value.endOf('week')
  })

  const minWeeks = computed(() => {
    return props.minWeeks ?? 1
  })

  const weekdays = computed(() => {
    return dayjs.weekdaysShort()
  })

  const todayWeek = computed(() => {
    const start = today.startOf('week')

    return Array(7)
      .fill(0)
      .map((_, i) => {
        const target = start.add(i, 'days')

        return getCalendarDate(target)
      })
  })

  const days = computed(() => {
    const start = startOfWeek.value
    const end = endOfWeek.value
    const minDays = minWeeks.value * 7
    const totalDays = Math.max(end.diff(start, 'day') + 1, minDays)

    return Array(totalDays)
      .fill(0)
      .map<{
        value: string
        isToday: boolean
        isOutside: boolean
        events: CalendarEventExtended<T>[]
        allDayEvents: CalendarEventExtended<T>[]
        date: CalendarDate
        weekNumber: number
      }>((_, i) => {
        const target = start.add(i, 'days')
        const weekNumber = Math.floor(target.diff(target.startOf('year'), 'day') / 7) + 1
        const isOutside = target.isBefore(startOfWeek.value, 'day') || target.isAfter(endOfWeek.value, 'day')
        const filteredEvents = filterEventsForDate(props.events, target)

        const allEvents = sortEvents(
          filteredEvents.map((event, id) =>
            processCalendarEvent({
              target,
              event,
              eventId: id,
              eventColor: props.eventColor,
              isWeekly: true,
              getBackgroundColorAttributes,
            }),
          ),
        )

        const allDayEvents = allEvents.filter((event) => !event.timed)
        const timedEvents = allEvents.filter((event) => event.timed)

        return {
          isToday: today.isSame(target, 'day'),
          isOutside,
          value: target.date().toString(),
          events: timedEvents,
          allDayEvents,
          date: getCalendarDate(target),
          weekNumber,
        }
      })
  })

  const weeks = computed(() => {
    const daysValue = days.value

    const weeks: Array<{
      weekNumber: number
      days: typeof daysValue
    }> = []

    for (let i = 0; i < daysValue.length; i += 7) {
      const weekDays = daysValue.slice(i, i + 7)

      weeks.push({
        weekNumber: weekDays[0]?.weekNumber ?? 0,
        days: weekDays,
      })
    }

    return weeks
  })

  return {
    weekdays,
    todayWeek,
    days,
    weeks,
  }
}
