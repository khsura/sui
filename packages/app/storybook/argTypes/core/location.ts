import type { ArgTypes } from '@storybook/vue3'
import type { PropsLocation } from '~/index'
import { getMarkdownArrayTypeDescription } from '~/storybook/helpers'

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
