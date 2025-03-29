import { sizeProperties } from '@khsura/sui/index'
import type { PropsSizePreset } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'

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
