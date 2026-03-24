import { type CalendarEvent, type CalendarEventExtended, type ProcessEventOptions } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const processCalendarEvent = <T extends CalendarEvent>({
  target,
  event,
  eventId,
  eventColor,
  isWeekly = false,
  getBackgroundColorAttributes,
}: ProcessEventOptions<T>): CalendarEventExtended<T> => {
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
  const displaySize = isStartDate || isWeekStart ? Math.min(diff + 1, 7 - target.day()) : 0

  const displayWidth = isWeekly
    ? `${displaySize * 100}%`
    : `calc(${displaySize * 100}% - ${!isLastOverflow ? 4 : isWeekStart ? 4 : 8}px)`

  const hasColorAttributes = isStartDate || isWeekStart
  const color = eventColor ? eventColor(event) : event.color
  const colorAttributes = getBackgroundColorAttributes(color)

  return {
    ...event,
    id: eventId,
    isStartDate,
    isWeekStart,
    isWeekEnd,
    isEndDate,
    style: {
      ...(hasColorAttributes ? colorAttributes.style : {}),
      width: displayWidth,
    },
    class: {
      ...(hasColorAttributes ? colorAttributes.class : {}),
    },
  }
}

export const filterEventsForDate = <T extends CalendarEvent>(events: T[] | undefined, target: dayjs.Dayjs): T[] => {
  if (!events) {
    return []
  }

  return events.filter((event) => {
    return target.isBetween(dayjs(event.start), dayjs(event.end ?? event.start), 'day', '[]')
  })
}

export const sortEvents = <T extends CalendarEvent>(events: CalendarEventExtended<T>[]): CalendarEventExtended<T>[] => {
  return [...events].sort((a, b) => {
    // All-day events first
    if (!a.timed && b.timed) {
      return -1
    }

    if (a.timed && !b.timed) {
      return 1
    }

    // For timed events, sort by start time
    if (a.timed && b.timed) {
      const aStart = dayjs(a.start).valueOf()
      const bStart = dayjs(b.start).valueOf()

      return aStart - bStart
    }

    // For all-day events, maintain original order
    return 0
  })
}
