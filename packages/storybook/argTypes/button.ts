import type { SButton } from '@khsura/sui/index'
import type { ArgTypes, ComponentPropsAndSlots } from '@storybook/vue3'
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
