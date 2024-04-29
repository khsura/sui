import { propsMeasurableStyles } from '@sui/app/props/core/measurableStyles'

import { propsActivator, propsLocation } from './core'

export const propsDialog = () => {
  return {
    persistent: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    ...propsLocation(),
    ...propsMeasurableStyles(),
    ...propsActivator(),
  }
}
