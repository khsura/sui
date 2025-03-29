import { type PropType } from 'vue'
import { type LocationRaw } from '~/types'

import { propsActivator, propsContent, propsLocation } from './core'
import { propsPosition } from './positionProps'

export const propsMenu = (defaults?: { location: LocationRaw }) => {
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
    screenPadding: {
      type: Number as PropType<number | undefined | null>,
      default: null,
    },
    ...propsPosition(),
    ...propsLocation(defaults),
    ...propsContent(),
    ...propsActivator(),
  } as const
}
