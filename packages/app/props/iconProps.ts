import { type MaterialDesignIcon, type MaterialDesignIconExtra } from '@sui/app/types'
import { propsSizeUnion } from './sizeProps'
import { propsTextColor, propsComponentTheme } from './core'
import { type PropType } from 'vue'

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
