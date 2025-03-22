import type { PropsDisabled } from '@khsura/sui'
import type { ArgTypes } from '@storybook/vue3'

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
