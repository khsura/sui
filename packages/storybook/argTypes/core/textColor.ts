import colorString from '@sui/app/types/core/color?raw'
import _ from 'lodash'
import type { PropsColor } from '@sui/app'
import type { ArgTypes } from '@storybook/types'

export const argTypesTextColor = <T extends ArgTypes<PropsColor>>(params: Partial<T>): T => {
  return _.merge(
    {
      color: {
        control: { type: 'color' },
        table: {
          defaultValue: { summary: 'null' },
          type: {
            summary: 'PresetColorType | ExposedAppColorType | string',
            detail: colorString.replaceAll(/export /gs, ''),
          },
        },
      },
    },
    params,
  ) as T
}
