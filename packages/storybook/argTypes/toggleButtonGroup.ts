import type { PropsToggleButtonGroup } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/types'
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
