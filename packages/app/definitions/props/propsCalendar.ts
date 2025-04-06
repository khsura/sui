import type { CalendarEvent } from '@khsura/sui/types'
import { type PropsTag } from './core'

export type PropsCalendar = {
  type?: 'month'
  // focus?: string
  events?: CalendarEvent[]
  eventColor?: (event: CalendarEvent) => string
} & PropsTag

export type PropsCalendarMonthly = PropsCalendar & {
  type: 'month'
  focus?: string
}
