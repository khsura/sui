import { type PropType } from 'vue'
import { propsTag } from './core'

export const propsToolbarTitle = () => {
  return {
    text: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    ...propsTag(),
  }
}
