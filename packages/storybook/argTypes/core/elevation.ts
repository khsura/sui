import type { PropsElevation } from '@khsura/sui'
import type { ArgTypes } from '@storybook/vue3'

export const argTypesElevation: ArgTypes<PropsElevation> = {
  elevation: {
    type: 'number',
    control: {
      type: 'number',
      max: 24,
      min: 0,
    },
    description: '0 ~ 24',
    table: {
      defaultValue: {
        summary: 'null',
      },
      type: {
        summary: 'number',
      },
    },
  },
}
