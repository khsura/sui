import { type PropsColor, type PropsTag } from './core'
import type { CalendarEvent } from '@/app/types'

export type PropsCalendarBase<T extends CalendarEvent> = {
  events?: T[]
  eventColor?: (event: T) => string
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

export type PropsCalendar<T extends CalendarEvent> = PropsCalendarBase<T> & {
  type?: 'month' | 'week'
} & Partial<PropsCalendarWeeklySpecific>

export type PropsCalendarMonthly<T extends CalendarEvent> = PropsCalendarBase<T> & {
  type: 'month'
  focus?: string
}

export type PropsCalendarWeekly<T extends CalendarEvent> = PropsCalendarBase<T> &
  PropsCalendarWeeklySpecific & {
    type: 'week'
    focus?: string
  }
