import type { PropsDisabled } from '@sui/app/index'
import type { ArgTypes } from '@storybook/types'

export const argTypesDisabled: ArgTypes<PropsDisabled> = {
  readonly: {
    type: 'boolean',
    description: 'user-select: none;',
    table: {
      defaultValue: {
        summary: 'false',
      },
      type: {
        summary: 'boolean',
      },
    },
  },
  disabled: {
    type: 'boolean',
    table: {
      defaultValue: {
        summary: 'false',
      },
      type: {
        summary: 'boolean',
      },
    },
  },
}
