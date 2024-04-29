import { type PropType } from 'vue'
import { propsBorder } from './core/borderProps'

export const propsTabs = () => {
  return {
    modelValue: {
      type: [Number, String] as PropType<string | number>,
      required: true,
      default: '',
    },
    dense: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    bordered: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    selectedTabColor: {
      type: String as PropType<string>,
      default: 'primary',
    },
    shrink: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    ...propsBorder(),
  }
}
