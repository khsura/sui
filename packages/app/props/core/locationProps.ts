import { type LocationRaw } from '@sui/app/types/location'

import { type PropType } from 'vue'

export const propsLocation = (defaults?: { location: LocationRaw }) => {
  return {
    /** @description `top`, `bottom`, `left`, `right`, `top left`, etc */
    location: {
      type: String as PropType<LocationRaw>,
      default: defaults?.location ?? null,
    },
  }
}
