import { type MaterialDesignIcon, type MaterialDesignIconExtra } from '@khsura/sui/types'
import { type PropType } from 'vue'
import { propsSizeUnion } from './sizeProps'
import { propsTextColor, propsComponentTheme } from './core'

export const propsIcon = () => {
  return {
    icon: {
      type: String as PropType<MaterialDesignIcon>,
      required: true,
    },
    extra: {
      type: Array as PropType<Array<MaterialDesignIconExtra | string> | null>,
      default: () => [],
    },
    rotated: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    ...propsSizeUnion(),
    ...propsTextColor(),
    ...propsComponentTheme(),
  } as const
}
