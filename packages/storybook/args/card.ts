import type { SCard } from '@sui/app/components'
import { argsBorder, argsColor, argsElevation, argsMeasurableStyles, argsSlot } from './core'
import type { ComponentPropsAndSlots } from '@storybook/vue3'

export const argsCard = <T extends Partial<ComponentPropsAndSlots<typeof SCard>>>(args?: T): T => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const output: T = {
    ...argsBorder,
    ...argsColor,
    ...argsElevation,
    ...argsMeasurableStyles,
    ...argsSlot(args?.default),
  } as T

  return output
}
