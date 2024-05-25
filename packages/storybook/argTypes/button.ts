import {
  argTypesColor,
  argTypesDisabled,
  argTypesMeasurableStyles,
  argTypesSizePreset,
  argTypesComponentTheme,
  argTypesSlot,
  argTypesLink,
  argTypesElevation,
  argTypesBorder,
  argTypesVariant,
} from '@khsura/storybook/argTypes'
import type { SButton } from '@khsura/sui/components'
import type { ArgTypes } from '@storybook/types'
import type { ComponentPropsAndSlots } from '@storybook/vue3'

export const argTypesButton: Partial<ArgTypes<ComponentPropsAndSlots<typeof SButton>>> = {
  ...argTypesColor,
  ...argTypesSizePreset,
  ...argTypesMeasurableStyles,
  ...argTypesDisabled,
  ...argTypesComponentTheme,
  ...argTypesSlot,
  ...argTypesLink,
  ...argTypesElevation,
  ...argTypesBorder,
  ...argTypesVariant(),
}
