import { propsActivator, propsElevation, propsLocation, propsMeasurableStyles } from './core'

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
    borderless: {
      type: Boolean,
      default: false,
    },
    scrollableBackground: {
      type: Boolean,
      default: false,
    },
    ...propsLocation(),
    ...propsMeasurableStyles(),
    ...propsActivator(),
    ...propsElevation(),
  }
}
