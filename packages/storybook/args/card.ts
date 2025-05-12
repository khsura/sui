import type { PropsCard } from '@khsura/sui/index'
import { argsBorder, argsColor, argsElevation, argsMeasurableStyles, argsSlot } from './core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const argsCard = (args?: Partial<PropsCard & { default: any }>): Partial<PropsCard> => {
  return {
    ...argsBorder,
    ...argsColor,
    ...argsElevation,
    ...argsMeasurableStyles,
    ...argsSlot(args?.default),
  }
}
