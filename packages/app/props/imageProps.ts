import { type LazyLoad } from '@sui/app/constants'

import { type PropType } from 'vue'

export const propsImage = () => {
  return {
    src: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    alt: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    objectFit: {
      type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
      default: 'cover',
    },
    aspectRatio: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
    lazyLoad: {
      type: String as PropType<LazyLoad | null>,
      default: null,
    },
  }
}
