import { type PropType } from 'vue'

export const propsTextColor = () => {
  return {
    color: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
  } as const
}
