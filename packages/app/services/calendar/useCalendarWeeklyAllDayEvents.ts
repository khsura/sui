import { computed } from 'vue'
import type { PropsCalendarWeekly } from '@/app/definitions'
import type { CalendarEvent, CalendarEventExtended } from '@/app/types'

type DayWithEvents<T extends CalendarEvent> = {
  date: { date: string }
  events: CalendarEventExtended<T>[]
  allDayEvents: CalendarEventExtended<T>[]
}

type Week<T extends CalendarEvent> = {
  days: DayWithEvents<T>[]
}

export const useCalendarWeeklyAllDayEvents = <T extends CalendarEvent>(
  props: Pick<PropsCalendarWeekly<T>, 'allDayRows'>,
  getAllDayEventRow: <T extends CalendarEvent>(day: DayWithEvents<T>, eventIndex: number, week: Week<T>) => number,
) => {
  const computedAllDayRows = computed(() => props.allDayRows ?? 7)

  const getMaxAllDayRowForDay = <T extends CalendarEvent>(day: DayWithEvents<T>, week: Week<T>) => {
    if (day.allDayEvents.length === 0) {
      return -1
    }

    return Math.max(...day.allDayEvents.map((_, eventIndex) => getAllDayEventRow(day, eventIndex, week)), -1)
  }

  const getAllDayEventsToDisplay = <T extends CalendarEvent>(
    day: DayWithEvents<T>,
    week: Week<T>,
    isAllDayExpanded: (dayDate: string) => boolean,
  ): CalendarEventExtended<T>[] => {
    const maxRows = computedAllDayRows.value
    const isExpanded = isAllDayExpanded(day.date.date)
    const maxRow = getMaxAllDayRowForDay(day, week)

    if (maxRow < maxRows || isExpanded) {
      return day.allDayEvents
    }

    return day.allDayEvents.filter((_, eventIndex) => {
      const row = getAllDayEventRow(day, eventIndex, week)

      return row < maxRows
    })
  }

  const hasMoreAllDayEvents = (day: DayWithEvents<T>, week: Week<T>) => {
    const maxRows = computedAllDayRows.value
    const maxRow = getMaxAllDayRowForDay(day, week)

    return maxRow >= maxRows
  }

  const getAllDayRowHeightForDay = (
    day: DayWithEvents<T>,
    week: Week<T>,
    isAllDayExpanded: (dayDate: string) => boolean,
  ) => {
    const maxRows = computedAllDayRows.value
    const isExpanded = isAllDayExpanded(day.date.date)
    const maxRow = getMaxAllDayRowForDay(day, week)

    if (maxRow < 0) {
      return 0
    }

    const visibleRows = isExpanded ? maxRow + 1 : Math.min(maxRow + 1, maxRows)

    return visibleRows * 24
  }

  const getAllDayRowHeight = (week: Week<T>, isAllDayExpanded: (dayDate: string) => boolean) => {
    let maxHeight = 0

    for (const day of week.days) {
      const dayHeight =
        getAllDayRowHeightForDay(day, week, isAllDayExpanded) + (hasMoreAllDayEvents(day, week) ? 24 : 0)

      maxHeight = Math.max(maxHeight, dayHeight)
    }

    return maxHeight > 0 ? Math.max(maxHeight, 24) : 0
  }

  return {
    getMaxAllDayRowForDay,
    getAllDayEventsToDisplay,
    hasMoreAllDayEvents,
    getAllDayRowHeightForDay,
    getAllDayRowHeight,
  }
}
