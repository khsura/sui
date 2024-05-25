import type { MaterialDesignIcon } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/types'

export const argTypesIcon: ArgTypes<{ icon: MaterialDesignIcon }> = {
  icon: {
    name: 'icon',
    type: {
      name: 'string',
      required: true,
    },
    control: { type: 'text' },
    description: `**icon** attribute of **SIcon** component`,
    table: {
      defaultValue: { summary: 'null' },
      type: {
        summary: 'MaterialDesignIcon',
      },
    },
  },
}
