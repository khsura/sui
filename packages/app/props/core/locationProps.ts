import { type PropType } from 'vue'
import { type LocationRaw } from '~/types'

export const propsLocation = (defaults?: { location: LocationRaw }) => {
  return {
    /** @description `top`, `bottom`, `left`, `right`, `top left`, etc */
    location: {
      type: String as PropType<LocationRaw>,
      default: defaults?.location ?? null,
    },
  }
}
