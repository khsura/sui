import type { ComponentPropsAndSlots } from '@storybook/vue3'
import type { SCard } from '~/index'
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
