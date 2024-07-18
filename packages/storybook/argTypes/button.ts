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
import type { ArgTypes } from '@storybook/vue3'
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
