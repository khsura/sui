import { type LocationRaw } from '@sui/app/types'

import { type PropType } from 'vue'
import { propsActivator, propsLocation, propsSelectMenuActivator } from './core'

export const propsMenu = (defaults?: { location: LocationRaw }) => {
  return {
    ...propsMenuBase(defaults),
    ...propsActivator(),
  } as const
}
export const propsMenuBase = (defaults?: { location: LocationRaw }) => {
  return {
    closeOnContentClick: {
      type: Boolean,
      default: true,
    },
    closeOnScroll: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: Number as PropType<number | undefined | null>,
      default: null,
    },
    offsetY: {
      type: Number as PropType<number | undefined | null>,
      default: null,
    },
    ...propsLocation(defaults),
  } as const
}
export const propsSelectMenu = () => {
  return {
    ...propsMenuBase(),
    ...propsSelectMenuActivator(),
  } as const
}
