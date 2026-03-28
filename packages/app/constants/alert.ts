import type { SizePropertyType } from '@/app/types'

export const alertPaddingsMap = {
  mini: {
    horizontal: 8,
    vertical: 4,
  },
  small: {
    horizontal: 12,
    vertical: 6,
  },
  default: {
    horizontal: 16,
    vertical: 12,
  },
  large: {
    horizontal: 20,
    vertical: 16,
  },
  extra: {
    horizontal: 24,
    vertical: 20,
  },
} as const

export const alertDensePaddingsMap = {
  mini: {
    horizontal: 6,
    vertical: 2,
  },
  small: {
    horizontal: 8,
    vertical: 4,
  },
  default: {
    horizontal: 12,
    vertical: 6,
  },
  large: {
    horizontal: 16,
    vertical: 8,
  },
  extra: {
    horizontal: 20,
    vertical: 10,
  },
} as const

export const alertFontSizeMap = {
  mini: 12,
  small: 14,
  default: 16,
  large: 18,
  extra: 20,
} as const

export const alertDefaultSize = 'default' satisfies SizePropertyType
