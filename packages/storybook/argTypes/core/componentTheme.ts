import appThemeString from '@khsura/sui/constants/app?raw'
import type { PropsComponentTheme } from '@khsura/sui/definitions'
import { AppTheme } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'
import { extractInterfaceString } from '@khsura/storybook/helpers'

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
