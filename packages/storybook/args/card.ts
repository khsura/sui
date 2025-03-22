import type { SCard } from '@khsura/sui'
import type { ComponentPropsAndSlots } from '@storybook/vue3'
import { argsBorder, argsColor, argsElevation, argsMeasurableStyles, argsSlot } from './core'

export const argsCard = <T extends Partial<ComponentPropsAndSlots<typeof SCard>>>(args?: T): T => {
  const output: T = {
    ...argsBorder,
    ...argsColor,
    ...argsElevation,
    ...argsMeasurableStyles,
    ...argsSlot(args?.default),
  } as T

  return output
}
