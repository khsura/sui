import { type PropsTag } from './core'
import type { CalendarEvent } from '@/app/types'

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
