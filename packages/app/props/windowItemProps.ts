import { propsSingleGroupItem } from './singleGroupItemProps'

export const propsWindowItem = () => {
  return {
    reverseTransition: {
      type: [Boolean, String],
      default: undefined,
    },
    transition: {
      type: [Boolean, String],
      default: undefined,
    },
    ...propsSingleGroupItem(),
  }
}
