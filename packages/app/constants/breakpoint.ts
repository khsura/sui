import { type DisplayOptions } from '@khsura/sui/types'
import breakpoints from '@khsura/sui/styles/modules/breakpoints.module.scss'
import { z } from 'zod'

export const scrollBarWidth: DisplayOptions['scrollBarWidth'] = 16 as const

const parsedThresholds = z
  .object({
    breakpointXs: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
    breakpointSm: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
    breakpointMd: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
    breakpointLg: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
    breakpointXl: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
    breakpointXxl: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace('px', '')) : undefined), z.number()),
  })
  .safeParse(breakpoints)

export const thresholds: DisplayOptions['thresholds'] = parsedThresholds.success
  ? {
      xs: parsedThresholds.data.breakpointXs,
      sm: parsedThresholds.data.breakpointSm,
      md: parsedThresholds.data.breakpointMd,
      lg: parsedThresholds.data.breakpointLg,
      xl: parsedThresholds.data.breakpointXl,
      xxl: parsedThresholds.data.breakpointXxl,
    }
  : {
      xs: 640,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1536,
      xxl: 1980,
    }
