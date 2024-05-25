import { AppTheme } from '@khsura/sui/constants'
import appThemeString from '@khsura/sui/constants/app?raw'
import { extractInterfaceString } from '@khsura/storybook/helpers'
import type { PropsComponentTheme } from '@khsura/sui/definitions'
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
