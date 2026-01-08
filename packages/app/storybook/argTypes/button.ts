import type { ArgTypes, ComponentPropsAndSlots } from '@storybook/vue3'
import type { SButton } from '@/app/index'
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
} from '@/app/storybook/argTypes'

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
