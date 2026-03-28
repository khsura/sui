import type dayjs from '@/app/vendors/dayjs'

export interface CalendarDate {
  date: string
  time: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
  weekday: number
  // hasDay: boolean
  // hasTime: boolean
  past: boolean
  present: boolean
  future: boolean
}

export interface CalendarEvent {
  name: string
  start: Date | string
  end?: Date | string
  color: string
  timed: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any
}

export interface CalendarEmitEvents<T extends CalendarEvent> {
  (event: 'change', value: { start: CalendarDate; end: CalendarDate }): void
  (event: 'click:event', value: { date: CalendarDate; event: T }): void
  (event: 'click:date', value: { date: CalendarDate; events: T[] }): void
  (event: 'click:time', value: { date: CalendarDate; events: T[] }): void
}

export type CalendarEventExtended<T extends CalendarEvent> = T & {
  isStartDate: boolean
  isEndDate: boolean
  id: number
  isWeekStart: boolean
  isWeekEnd: boolean
  class: Record<string, boolean>
  style: Record<string, string>
}

export type ProcessEventOptions<T extends CalendarEvent> = {
  target: dayjs.Dayjs
  event: T
  eventId: number
  eventColor?: (event: T) => string
  isWeekly?: boolean
  getBackgroundColorAttributes: (color: string | null) => {
    class: Record<string, boolean>
    style: Record<string, string>
  }
}

export type CalendarType = 'month' | 'week'
