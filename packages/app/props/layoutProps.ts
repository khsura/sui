import { type PropType } from 'vue'
import { propsCoreLayout } from './core'

export const propsLayout = (defaults?: Parameters<typeof propsCoreLayout>[0]) => {
  return {
    ...propsCoreLayout(defaults),
    for: {
      type: String as PropType<string | undefined>,
      default: null,
    },
  }
}
