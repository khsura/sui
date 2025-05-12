import type { PropsBorder } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'

export const argTypesBorder: ArgTypes<PropsBorder> = {
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
  borderRadius: {
    type: 'string',
    table: {
      defaultValue: {
        summary: 'null',
      },
      type: {
        summary: 'string',
      },
    },
    description: 'takes rounded, tile, or css number value',
  },
}
