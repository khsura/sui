import { type PropType } from 'vue'
import { propsColor, propsMeasurableStyles, propsTag } from './core'

export const propsList = () => {
  return {
    divided: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // TODO (Sura) add validator
    // eslint-disable-next-line vue/no-unused-properties
    lines: {
      type: Number as PropType<number | null>,
      default: null,
    },
    outlined: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    dense: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    link: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    inset: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    text: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    ...propsMeasurableStyles(),
    ...propsColor(),
    ...propsTag<'ul' | 'ol' | 'div'>({ tag: 'ul' }),
  } as const
}
