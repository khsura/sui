import { type PropType } from 'vue'
import { propsCoreLayout } from './core'

export const propsLayoutProvider = (defaults?: Parameters<typeof propsCoreLayout>[0]) => {
  return {
    ...propsCoreLayout(defaults),
    name: {
      type: String as PropType<string | null>,
      default: null,
    },
  }
}
