import type { ArgTypes } from '@storybook/vue3'
import type { MaterialDesignIcon } from '@/app/index'

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
