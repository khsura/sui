import type { ArgTypes } from '@storybook/vue3'
import { sizeProperties } from '~/index'
import type { PropsSizePreset } from '~/index'

export const argTypesSizePreset: ArgTypes<PropsSizePreset> = {
  size: {
    options: [null, ...sizeProperties],
    control: { type: 'select', labels: { null: 'unset' } },
    table: {
      type: {
        summary: 'SizePropertyType',
      },
    },
  },
}
