import type { ArgTypes } from '@storybook/vue3'
import type { PropsVariant } from '~/index'

export const argTypesVariant = (): ArgTypes<PropsVariant> => {
  return {
    variant: {
      type: 'string',
      description: 'variants of selected component',
      control: {
        type: 'select',
      },
      options: [null, 'fab', 'text', 'icon'],
      table: {
        defaultValue: {
          summary: 'undefined',
        },
        type: {
          summary: 'fab | text | icon',
        },
      },
    },
  }
}
