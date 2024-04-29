import { type PropType } from 'vue'

export const propsDisabled = () => {
  return {
    disabled: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: false,
    },
    readonly: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: false,
    },
  }
}
