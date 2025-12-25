import type { ArgTypes } from '@storybook/vue3'
import appThemeString from '@/app/constants/app?raw'
import type { PropsComponentTheme } from '@/app/definitions'
import { AppTheme } from '@/app/index'
import { extractInterfaceString } from '@/app/storybook/helpers'

export const argTypesComponentTheme: ArgTypes<PropsComponentTheme> = {
  theme: {
    options: [null, AppTheme.light, AppTheme.dark],
    control: { type: 'select' },
    type: {
      name: 'string',
      required: false,
    },
    table: {
      defaultValue: {
        summary: 'null',
      },
      type: {
        summary: 'AppTheme | null',
        detail: extractInterfaceString(appThemeString, 'AppTheme'),
      },
    },
  },
}
