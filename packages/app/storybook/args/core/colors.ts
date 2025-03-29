import type { PropsColor } from '~/index'
import { argsComponentTheme } from './componentTheme'

export const argsColor = {
  color: '',
  ...argsComponentTheme,
} satisfies PropsColor
