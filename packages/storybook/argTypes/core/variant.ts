import type { PropsButtonVariant } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'

export const argTypesVariant = (): ArgTypes<PropsButtonVariant> => {
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
