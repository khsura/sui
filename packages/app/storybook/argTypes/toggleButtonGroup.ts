import type { ArgTypes } from '@storybook/vue3'
import type { PropsToggleButtonGroup } from '~/index'
import { argTypesBorder, argTypesColor } from './core'

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
