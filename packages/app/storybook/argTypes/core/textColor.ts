import type { ArgTypes } from '@storybook/vue3'
import _ from 'lodash'
import type { PropsColor } from '~/index'
import colorString from '~/types/core/color?raw'

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
