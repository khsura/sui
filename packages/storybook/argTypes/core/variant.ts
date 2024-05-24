import type { PropsVariant } from '@sui/app/index'
import type { ArgTypes } from '@storybook/types'

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
