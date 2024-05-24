import { getMarkdownArrayTypeDescription } from '@sui/storybook/helpers'
import type { PropsLocation } from '@sui/app/index'
import type { ArgTypes } from '@storybook/types'

const options = [null, 'top', 'right', 'bottom', 'left', 'top left', 'top right', 'bottom left', 'bottom right']

export const argTypesLocation: ArgTypes<PropsLocation> = {
  location: {
    type: 'string',
    control: {
      type: 'select',
    },
    options,
    table: {
      type: {
        summary: 'string | null',
        detail: getMarkdownArrayTypeDescription(options),
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
}
