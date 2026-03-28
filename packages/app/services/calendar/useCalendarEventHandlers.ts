import type { CalendarDate, CalendarEvent, CalendarEmitEvents, CalendarEventExtended } from '@/app/types'

export const useCalendarEventHandlers = <T extends CalendarEvent>(emit: CalendarEmitEvents<T>) => {
  const getEvents = (date: CalendarDate, events: CalendarEventExtended<T>[]) => ({
    date,
    events: events.filter((event) => event) as CalendarEventExtended<T>[],
  })

  const getEvent = (date: CalendarDate, event: CalendarEventExtended<T>) => ({
    date,
    event,
  })

  const onClickEvent = (value: { date: CalendarDate; event: T }) => {
    emit('click:event', value)
  }

  const onClickDate = (value: { date: CalendarDate; events: CalendarEventExtended<T>[] }) => {
    emit('click:date', value)
  }

  return {
    getEvents,
    getEvent,
    onClickEvent,
    onClickDate,
  }
}
