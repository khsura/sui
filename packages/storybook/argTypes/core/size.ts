import { sizeProperties } from '@khsura/sui/configs'
import type { PropsSizePreset } from '@khsura/sui/definitions'
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
