import type { ArgTypes } from '@storybook/vue3'
import { argTypesBorder, argTypesColor } from './core'
import type { PropsToggleButtonGroup } from '@/app/index'

const { underlined: _, ...borderArgTypes } = argTypesBorder

export const argTypesToggleButtonGroup: Partial<ArgTypes<PropsToggleButtonGroup>> = {
  ...borderArgTypes,
  selectedColor: argTypesColor.color,
  shrink: {
    type: 'boolean',
  },
  multiple: {
    type: 'boolean',
  },
  variant: {
    type: {
      name: 'string',
      required: false,
    },
    control: {
      type: 'select',
    },
    options: [null, 'underlined', 'inset'],
  },
}
