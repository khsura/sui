import type { CalendarDate, CalendarEvent, CalendarEmitEvents } from '@/app/types'

export const useCalendarEventHandlers = (emit: CalendarEmitEvents) => {
  const getEvents = (date: CalendarDate, events: CalendarEvent[]) => ({
    date,
    events: events.filter((event) => event) as CalendarEvent[],
  })

  const getEvent = (date: CalendarDate, event: CalendarEvent) => ({
    date,
    event,
  })

  const onClickEvent = (value: { date: CalendarDate; event: CalendarEvent }) => {
    emit('click:event', value)
  }

  const onClickDate = (value: { date: CalendarDate; events: CalendarEvent[] }) => {
    emit('click:date', value)
  }

  return {
    getEvents,
    getEvent,
    onClickEvent,
    onClickDate,
  }
}
