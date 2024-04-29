import { type PropType } from 'vue'
import { propsContent, propsGroup } from './core'

export const propsSlideGroup = () => {
  return {
    centerActive: {
      type: Boolean,
      default: false,
    },
    activeClass: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    slideStep: {
      type: Number as PropType<number | null | undefined>,
      default: null,
    },
    scrollable: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: null,
    },
    ...propsGroup(),
    ...propsContent(),
  }
}
