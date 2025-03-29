import { type PropType } from 'vue'
import { validatorNumericCssAttribute } from '~/validators'

export const propsSplitView = () => {
  return {
    vertical: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: '100%',
      validator: validatorNumericCssAttribute,
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: '100%',
      validator: validatorNumericCssAttribute,
    },
  }
}
