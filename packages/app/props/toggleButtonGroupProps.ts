import { type PropType } from 'vue'
import { propsBorder, propsGroup, propsToggleButtonGroupVariant } from './core'

const { underlined, ...borderProps } = propsBorder()

export const propsToggleButtonGroup = () => {
  return {
    dense: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    bordered: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    selectedColor: {
      type: String as PropType<string>,
      default: 'primary',
    },
    shrink: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    nowrap: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    ...propsGroup(),
    ...borderProps,
    ...propsToggleButtonGroupVariant(),
  } as const
}
