import { sizeProperties } from '@sui/app/configs'
import type { PropsSizePreset } from '@sui/app/definitions'
import type { ArgTypes } from '@storybook/types'

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
