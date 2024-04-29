import { type PropType, type ComponentPublicInstance } from 'vue'
import { propsDisabled } from './disabledProps'

const propsActivatorBase = {
  activator: {
    type: [String, Object] as PropType<string | HTMLElement | ComponentPublicInstance | null | undefined>,
    default: null,
  },
  closeOnClick: {
    type: Boolean as PropType<boolean | undefined | null>,
    default: true,
  },
  ...propsDisabled(),
}
export const propsActivator = () => {
  return {
    modelValue: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: null,
    },
    ...propsActivatorBase,
  } as const
}
export const propsSelectMenuActivator = () => {
  return {
    menu: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: null,
    },
    ...propsActivatorBase,
  }
}
