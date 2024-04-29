import { type PropType } from 'vue'
import { type RouteLocationRaw } from 'vue-router'

export const propsLink = () => {
  return {
    href: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    to: {
      type: [String, Object] as PropType<RouteLocationRaw | null | undefined>,
      default: null,
    },
  } as const
}
