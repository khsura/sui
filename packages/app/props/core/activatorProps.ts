import { type PropType, type ComponentPublicInstance } from 'vue'
import { propsDisabled } from './disabledProps'

export const propsActivator = () => ({
  activator: {
    type: [String, Object] as PropType<string | HTMLElement | ComponentPublicInstance | null | undefined>,
    default: null,
  },
  closeOnClick: {
    type: Boolean as PropType<boolean | undefined | null>,
    default: true,
  },
  ...propsDisabled(),
})
