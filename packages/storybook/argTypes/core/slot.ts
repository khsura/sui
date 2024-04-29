import type { ArgTypes } from '@storybook/types'

export const argTypesSlot: ArgTypes<{ default: string }> = {
  default: {
    name: 'default',
    type: 'string',
    control: { type: 'text' },
    description: 'default slot',
    table: {
      defaultValue: { summary: 'undefined' },
      type: { summary: 'string | VNodeChild | ((_: {}) => any)' },
    },
  },
}
