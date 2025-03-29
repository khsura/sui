import type { ArgTypes } from '@storybook/vue3'
import appThemeString from '~/constants/app?raw'
import type { PropsComponentTheme } from '~/definitions'
import { AppTheme } from '~/index'
import { extractInterfaceString } from '~/storybook/helpers'

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
