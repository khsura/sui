import { type PropsCalendar } from '@sui/app/definitions'
import { getCalendarDate } from '@sui/app/repositories/calendarRepository'
import { useColorRepository } from '@sui/app/repositories/colorRepository'
import { type CalendarDate, type CalendarEvent } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'
import { computed } from 'vue'

type CalendarEventExtended = CalendarEvent & {
  isStartDate: boolean
  isEndDate: boolean
  title: string
  id: number
  isWeekStart: boolean
  isWeekEnd: boolean
  class: Record<string, boolean>
  style: Record<string, string>
}

export const useCalendarMonthlyService = (props: PropsCalendar) => {
  const today = dayjs()
  const eventPadding = 4
  const { getBackgroundColorAttributes } = useColorRepository()

  const date = computed(() => {
    return dayjs(props.modelValue || undefined)
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

        const events: CalendarEventExtended[] = props.events
          .map((event, id) => {
            return {
              ...event,
              id,
            }
          })
          .filter((event) => {
            return target.isBetween(event.start, event.end ?? event.start, 'day', '[]')
          })
          .map<CalendarEventExtended>((event) => {
            const startDate = dayjs(event.start)
            const endDate = dayjs(event.end ?? event.start)
            const isStartDate = startDate.isSame(target, 'day')
            const isEndDate = endDate.isSame(target, 'day')
            const diffBetweenStartAndEnd = endDate.diff(startDate, 'day')
            const diffBetweenTargetAndEnd = endDate.diff(target, 'day')
            const isWeekStart = !isStartDate && target.day() === 0
            const diff = isWeekStart ? diffBetweenTargetAndEnd : diffBetweenStartAndEnd
            const isLastOverflow = diff + 1 < 7 - target.day()
            const isWeekEnd = !isEndDate && !isLastOverflow && target.day() === 6
            const padding = !isLastOverflow ? eventPadding : isWeekStart ? eventPadding : eventPadding * 2
            const displaySize = isStartDate || isWeekStart ? Math.min(diff + 1, 7 - target.day()) : 0
            const displayWidth = `calc(${displaySize * 100}% - ${padding}px)`
            const hasColorAttributes = isStartDate || isWeekStart
            const color = props.eventColor ? props.eventColor(event) : event.color
            const colorAttributes = getBackgroundColorAttributes(color)

            const outputEvent: CalendarEventExtended = {
              ...event,
              isStartDate,
              isWeekStart,
              isWeekEnd,
              isEndDate,
              title: `${event.timed ? startDate.format('H:mm') + ' ' : ''}${event.name}`,
              style: {
                ...(hasColorAttributes ? colorAttributes.style : {}),
                width: displayWidth,
              },
              class: {
                ...(hasColorAttributes ? colorAttributes.class : {}),
              },
            }

            return outputEvent
          })

        events.sort((a, b) => {
          if (!a.timed) {
            return -1
          }

          if (!b.timed) {
            return 1
          }

          return 0
        })

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
