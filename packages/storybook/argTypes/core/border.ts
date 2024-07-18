import type { PropsBorder } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'

export const argTypesBorder: ArgTypes<PropsBorder> = {
  tile: {
    type: 'boolean',
    description: 'border radius will become 0',
    table: {
      defaultValue: {
        summary: 'false',
      },
      type: {
        summary: 'boolean',
      },
    },
  },
  rounded: {
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
  outlined: {
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
  underlined: {
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
