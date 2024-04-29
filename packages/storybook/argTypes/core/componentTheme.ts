import { AppTheme } from '@sui/app/constants'
import appThemeString from '@sui/app/constants/app?raw'
import { extractInterfaceString } from '@sui/storybook/helpers'
import type { PropsComponentTheme } from '@sui/app/definitions'
import type { ArgTypes } from '@storybook/types'

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
