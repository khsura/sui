import type { ArgTypes } from '@storybook/vue3'
import type { PropsMeasurableStyles } from '~/index'

export const argTypesMeasurableStyles: ArgTypes<PropsMeasurableStyles> = {
  height: {
    control: 'text',
  },
  width: {
    control: 'text',
  },
  maxWidth: {
    control: 'text',
  },
  minWidth: {
    control: 'text',
  },
  maxHeight: {
    control: 'text',
  },
  minHeight: {
    control: 'text',
  },
}
