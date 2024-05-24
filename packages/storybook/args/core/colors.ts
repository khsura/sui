import type { PropsColor } from '@sui/app/definitions'
import { argsComponentTheme } from './componentTheme'

export const argsColor = {
  color: '',
  ...argsComponentTheme,
} satisfies PropsColor
