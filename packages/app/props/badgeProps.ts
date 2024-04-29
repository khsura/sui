import { type STransition } from '@sui/app/constants'
import { type MaterialDesignIcon } from '@sui/app/types'
import { validatorNumericCssAttribute } from '@sui/app/validators'
import { type PropType } from 'vue'
import { propsColor } from './core'

export const propsBadge = () => {
  return {
    value: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    overlap: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    bottom: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    dot: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    left: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    tile: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    offsetX: {
      type: [Number, String] as PropType<string | number | null>,
      default: null,
      validator: validatorNumericCssAttribute,
    },
    offsetY: {
      type: [Number, String] as PropType<string | number | null>,
      default: null,
      validator: validatorNumericCssAttribute,
    },
    icon: {
      type: String as PropType<MaterialDesignIcon | null>,
      default: null,
    },
    content: {
      type: [String, Number] as PropType<string | number | null | undefined>,
      default: null,
    },
    label: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    transitionName: {
      type: String as PropType<STransition | null>,
      default: null,
    },
    ...propsColor(),
  }
}
