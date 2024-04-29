import type { PropsColor } from '@sui/app'
import { argTypesComponentTheme } from './componentTheme'
import type { ArgTypes } from '@storybook/types'

export const argTypesColor: ArgTypes<PropsColor> = {
  color: {
    control: {
      type: 'text',
    },
    type: { name: 'string', required: false },
    description: 'PresetColors or hex',
  },
  colorThreshold: {
    type: { name: 'string', required: false },
    description:
      'Specifies a value which switch content color from black to white (For aligning with background color).',
    control: {
      type: 'number',
      max: 100,
      min: 0,
    },
    table: { defaultValue: { summary: 'undefined', detail: 'Number as PropType<number | undefined>' } },
  },
  ...argTypesComponentTheme,
}
