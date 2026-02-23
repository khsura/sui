import type { CalendarEventExtended } from './calendarEventService'
import type { PropsCalendarWeekly } from '@/app/definitions'
import dayjs from '@/app/vendors/dayjs'

type DayWithEvents = {
  date: { date: string }
  events: CalendarEventExtended[]
  allDayEvents: CalendarEventExtended[]
}

type Week = {
  days: DayWithEvents[]
}

export const useCalendarWeeklyEventPositioning = (props: Pick<PropsCalendarWeekly, 'eventOverlapMode'>) => {
  const calculateAllDayEventRows = (week: Week) => {
    const uniqueEvents = new Map<
      string,
      {
        event: CalendarEventExtended
        startDate: dayjs.Dayjs
        endDate: dayjs.Dayjs
        instances: Array<{ dayIndex: number; eventIndex: number }>
      }
    >()

    week.days.forEach((day, dayIndex) => {
      day.allDayEvents.forEach((event, eventIndex) => {
        const eventKey = `${dayjs(event.start).format('YYYY-MM-DD')}-${dayjs(event.end ?? event.start).format('YYYY-MM-DD')}-${event.name || eventIndex}`
        const startDate = dayjs(event.start)
        const endDate = dayjs(event.end ?? event.start)

        if (!uniqueEvents.has(eventKey)) {
          uniqueEvents.set(eventKey, {
            event,
            startDate,
            endDate,
            instances: [],
          })
        }

        const eventData = uniqueEvents.get(eventKey)

        if (eventData) {
          eventData.instances.push({ dayIndex, eventIndex })
        }
      })
    })

    if (uniqueEvents.size === 0) {
      return { rowMap: new Map<string, number>(), totalRows: 0 }
    }

    const eventsArray = Array.from(uniqueEvents.values()).sort((a, b) => {
      const startDiff = a.startDate.valueOf() - b.startDate.valueOf()

      if (startDiff !== 0) {
        return startDiff
      }

      return a.endDate.valueOf() - b.endDate.valueOf()
    })

    const rows: Array<Array<(typeof eventsArray)[0]>> = []

    for (const currentEvent of eventsArray) {
      let placed = false

      for (const row of rows) {
        const overlaps = row.some(
          (rowEvent) =>
            (currentEvent.startDate.isBefore(rowEvent.endDate, 'day') ||
              currentEvent.startDate.isSame(rowEvent.endDate, 'day')) &&
            (currentEvent.endDate.isAfter(rowEvent.startDate, 'day') ||
              currentEvent.endDate.isSame(rowEvent.startDate, 'day')),
        )

        if (!overlaps) {
          row.push(currentEvent)
          placed = true
          break
        }
      }

      if (!placed) {
        rows.push([currentEvent])
      }
    }

    const rowMap = new Map<string, number>()

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (const event of rows[rowIndex]) {
        for (const instance of event.instances) {
          const key = `${instance.dayIndex}-${instance.eventIndex}`

          rowMap.set(key, rowIndex)
        }
      }
    }

    return { rowMap, totalRows: rows.length }
  }

  const getAllDayEventRow = (day: DayWithEvents, eventIndex: number, week: Week) => {
    const dayIndex = week.days.findIndex((d) => d.date.date === day.date.date)

    if (dayIndex === -1) {
      return 0
    }

    const { rowMap } = calculateAllDayEventRows(week)
    const key = `${dayIndex}-${eventIndex}`
    const row = rowMap.get(key) ?? 0

    return row
  }

  const calculateEventStacking = (dayEvents: CalendarEventExtended[]) => {
    if (dayEvents.length === 0) {
      return new Map<number, { column: number; totalColumns: number }>()
    }

    const eventPositions = new Map<number, { column: number; totalColumns: number }>()

    const events = dayEvents.map((event, index) => ({
      event,
      index,
      start: dayjs(event.start).valueOf(),
      end: dayjs(event.end ?? event.start).valueOf(),
    }))

    events.sort((a, b) => a.start - b.start)

    const groups: Array<Array<(typeof events)[0]>> = []

    for (const currentEvent of events) {
      let placed = false

      for (const group of groups) {
        const overlaps = group.some(
          (groupEvent) =>
            (currentEvent.start < groupEvent.end && currentEvent.end > groupEvent.start) ||
            (currentEvent.start === groupEvent.start && currentEvent.end === groupEvent.end),
        )

        if (overlaps) {
          group.push(currentEvent)
          placed = true
          break
        }
      }

      if (!placed) {
        groups.push([currentEvent])
      }
    }

    for (const group of groups) {
      group.sort((a, b) => {
        if (a.start !== b.start) {
          return a.start - b.start
        }

        return a.end - b.end
      })

      const columns: Array<Array<(typeof group)[0]>> = []

      for (const event of group) {
        let placedInColumn = false

        for (const column of columns) {
          const lastEvent = column[column.length - 1]

          if (event.start >= lastEvent.end) {
            column.push(event)
            placedInColumn = true
            break
          }
        }

        if (!placedInColumn) {
          columns.push([event])
        }
      }

      const totalColumns = columns.length

      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        for (const event of columns[colIndex]) {
          eventPositions.set(event.index, {
            column: colIndex,
            totalColumns,
          })
        }
      }
    }

    return eventPositions
  }

  const getEventStacking = (day: DayWithEvents, eventIndex: number) => {
    const stacking = calculateEventStacking(day.events)
    const position = stacking.get(eventIndex)

    if (!position) {
      return { left: '2px', width: 'calc(100% - 4px)' }
    }

    const { column, totalColumns } = position

    if (props.eventOverlapMode === 'column') {
      const columnWidth = 100 / totalColumns
      const leftPercent = column * columnWidth
      const left = `calc(${leftPercent}% + 2px)`
      const width = `calc(${columnWidth}% - 4px)`

      return { left, width }
    }

    const leftOffset = column * 16
    const left = `calc(${leftOffset}px)`
    const width = `calc(100% - ${leftOffset}px - 4px)`

    return { left, width }
  }

  const getEventPosition = (event: CalendarEventExtended, day: DayWithEvents, eventIndex: number) => {
    const startDate = dayjs(event.start)
    const endDate = dayjs(event.end ?? event.start)
    const startHour = startDate.hour()
    const startMinute = startDate.minute()
    const endHour = endDate.hour()
    const endMinute = endDate.minute()
    const minutesPerPixel = 1
    const pixelsPerHour = 60
    const top = startHour * pixelsPerHour + startMinute * minutesPerPixel
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute)
    const height = Math.max(duration * minutesPerPixel, 20)
    const stacking = getEventStacking(day, eventIndex)

    return {
      top: `${top}px`,
      height: `${height}px`,
      minHeight: `${height}px`,
      left: stacking.left,
      width: stacking.width,
    }
  }

  return {
    getAllDayEventRow,
    getEventPosition,
  }
}
