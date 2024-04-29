import { type LocationRaw } from '@sui/app/types'

import { type PropType } from 'vue'
import { propsActivator, propsContent, propsLocation } from './core'

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

    ...propsLocation(defaults),
    ...propsContent(),
    ...propsActivator(),
  } as const
}
