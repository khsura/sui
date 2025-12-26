import type { ArgTypes } from '@storybook/vue3'
import type { PropsColor } from '@/app/index'
import colorString from '@/app/types/core/color?raw'
import { merge } from '@/app/vendors/deepmerge'

export const argTypesTextColor = <T extends ArgTypes<PropsColor>>(params: Partial<T>): T => {
  return merge(
    {
      color: {
        control: { type: 'color' },
        table: {
          defaultValue: { summary: 'undefined' },
          type: {
            summary: 'PresetColorType | ExposedAppColorType | string | null | undefined',
            detail: colorString.replace(/export /gs, ''),
          },
        },
      },
    },
    params,
  ) as T
}
