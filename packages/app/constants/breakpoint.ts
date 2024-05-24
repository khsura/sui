import { type DisplayBreakpointName, type DisplayOptions } from '@sui/app/types'
import breakpoints from '@sui/app/styles/modules/breakpoints.module.scss'
import { z } from 'zod'

export const scrollBarWidth: DisplayOptions['scrollBarWidth'] = 16 as const

export const thresholds: DisplayOptions['thresholds'] = {
  xs: z.coerce.number().parse(breakpoints.breakpointXs.replace('px', '')),
  sm: z.coerce.number().parse(breakpoints.breakpointSm.replace('px', '')),
  md: z.coerce.number().parse(breakpoints.breakpointMd.replace('px', '')),
  lg: z.coerce.number().parse(breakpoints.breakpointLg.replace('px', '')),
  xl: z.coerce.number().parse(breakpoints.breakpointXl.replace('px', '')),
  xxl: z.coerce.number().parse(breakpoints.breakpointXxl.replace('px', '')),
} satisfies Record<DisplayBreakpointName, number>
