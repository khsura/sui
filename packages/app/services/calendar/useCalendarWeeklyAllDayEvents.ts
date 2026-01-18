import { computed } from 'vue'
import type { CalendarEventExtended } from './calendarEventService'
import type { PropsCalendarWeekly } from '@/app/definitions'

type DayWithEvents = {
  date: { date: string }
  events: CalendarEventExtended[]
  allDayEvents: CalendarEventExtended[]
}

type Week = {
  days: DayWithEvents[]
}

export const useCalendarWeeklyAllDayEvents = (
  props: Pick<PropsCalendarWeekly, 'allDayRows'>,
  getAllDayEventRow: (day: DayWithEvents, eventIndex: number, week: Week) => number,
) => {
  const computedAllDayRows = computed(() => props.allDayRows ?? 7)

  const getMaxAllDayRowForDay = (day: DayWithEvents, week: Week) => {
    if (day.allDayEvents.length === 0) {
      return -1
    }

    return Math.max(...day.allDayEvents.map((_, eventIndex) => getAllDayEventRow(day, eventIndex, week)), -1)
  }

  const getAllDayEventsToDisplay = (day: DayWithEvents, week: Week, isAllDayExpanded: (dayDate: string) => boolean) => {
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

  const hasMoreAllDayEvents = (day: DayWithEvents, week: Week) => {
    const maxRows = computedAllDayRows.value
    const maxRow = getMaxAllDayRowForDay(day, week)

    return maxRow >= maxRows
  }

  const getAllDayRowHeightForDay = (day: DayWithEvents, week: Week, isAllDayExpanded: (dayDate: string) => boolean) => {
    const maxRows = computedAllDayRows.value
    const isExpanded = isAllDayExpanded(day.date.date)
    const maxRow = getMaxAllDayRowForDay(day, week)

    if (maxRow < 0) {
      return 0
    }

    const visibleRows = isExpanded ? maxRow + 1 : Math.min(maxRow + 1, maxRows)

    return visibleRows * 24
  }

  const getAllDayRowHeight = (week: Week, isAllDayExpanded: (dayDate: string) => boolean) => {
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
