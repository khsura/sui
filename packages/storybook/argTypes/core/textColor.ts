import type { PropsColor } from '@khsura/sui'
import colorString from '@khsura/sui/types/core/color?raw'
import type { ArgTypes } from '@storybook/vue3'
import _ from 'lodash'

export const argTypesTextColor = <T extends ArgTypes<PropsColor>>(params: Partial<T>): T => {
  return _.merge(
    {
      color: {
        control: { type: 'color' },
        table: {
          defaultValue: { summary: 'null' },
          type: {
            summary: 'PresetColorType | ExposedAppColorType | string',
            detail: colorString.replace(/export /gs, ''),
          },
        },
      },
    },
    params,
  ) as T
}
