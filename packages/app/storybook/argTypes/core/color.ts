import type { ArgTypes } from '@storybook/vue3'
import type { PropsColor } from '~/index'
import { argTypesComponentTheme } from './componentTheme'

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
