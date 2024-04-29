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

export interface CalendarEmitEvents {
  (event: 'change', value: { start: CalendarDate; end: CalendarDate }): void
  (event: 'click:event', value: { date: CalendarDate; event: CalendarEvent }): void
  (event: 'click:date', value: { date: CalendarDate; events: CalendarEvent[] }): void
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
