import { type Display } from '@sui/app/types'

export const breakpoints = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
}

export const scrollBarWidth: Display['scrollBarWidth'] = 16 as const

export const thresholds: Display['thresholds'] = {
  xs: 600,
  sm: 960,
  md: 1280,
  lg: 1920,
} as const

export const mobileBreakpoint: Display['mobileBreakpoint'] = thresholds.xs
