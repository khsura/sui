import { type CalendarEvent } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export type CalendarEventExtended = CalendarEvent & {
  isStartDate: boolean
  isEndDate: boolean
  id: number
  isWeekStart: boolean
  isWeekEnd: boolean
  class: Record<string, boolean>
  style: Record<string, string>
}

type ProcessEventOptions = {
  target: dayjs.Dayjs
  event: CalendarEvent
  eventId: number
  eventColor?: (event: CalendarEvent) => string
  isWeekly?: boolean
  getBackgroundColorAttributes: (color: string | null) => {
    class: Record<string, boolean>
    style: Record<string, string>
  }
}

export const processCalendarEvent = ({
  target,
  event,
  eventId,
  eventColor,
  isWeekly = false,
  getBackgroundColorAttributes,
}: ProcessEventOptions): CalendarEventExtended => {
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

export const filterEventsForDate = (events: CalendarEvent[] | undefined, target: dayjs.Dayjs): CalendarEvent[] => {
  if (!events) {
    return []
  }

  return events.filter((event) => {
    return target.isBetween(dayjs(event.start), dayjs(event.end ?? event.start), 'day', '[]')
  })
}

export const sortEvents = (events: CalendarEventExtended[]): CalendarEventExtended[] => {
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
