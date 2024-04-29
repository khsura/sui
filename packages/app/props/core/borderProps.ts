import { type PropType } from 'vue'

export const propsBorder = () => {
  return {
    tile: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    outlined: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    underlined: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    rounded: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
  }
}
