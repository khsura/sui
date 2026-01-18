import { type PropsColor, type PropsTag } from './core'
import type { CalendarEvent } from '@/app/types'

export type PropsCalendarBase = {
  events?: CalendarEvent[]
  eventColor?: (event: CalendarEvent) => string
} & PropsTag &
  PropsColor

export type PropsCalendarWeeklySpecific = {
  minWeeks?: number
  showWeek?: boolean
  longWeekdays?: boolean
  showMonthOnFirst?: boolean
  shortMonths?: boolean
  hideHeader?: boolean
  eventOverlapMode?: 'stacked' | 'column'
  allDayRows?: number
}

export type PropsCalendar = PropsCalendarBase & {
  type?: 'month' | 'week'
} & Partial<PropsCalendarWeeklySpecific>

export type PropsCalendarMonthly = PropsCalendarBase & {
  type: 'month'
  focus?: string
}

export type PropsCalendarWeekly = PropsCalendarBase &
  PropsCalendarWeeklySpecific & {
    type: 'week'
    focus?: string
  }
