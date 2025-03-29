import type { ArgTypes } from '@storybook/vue3'
import type { PropsBorder } from '~/index'

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
