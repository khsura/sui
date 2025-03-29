import { type PropType } from 'vue'
import { type MaterialDesignIcon, type MaterialDesignIconExtra } from '~/types'
import { propsTextColor, propsComponentTheme } from './core'
import { propsSizeUnion } from './sizeProps'

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
