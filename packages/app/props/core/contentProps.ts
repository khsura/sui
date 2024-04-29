import { type HTMLAttributes, type PropType } from 'vue'

export const propsContent = () => {
  return {
    contentClass: {
      type: [String, Object] as PropType<HTMLAttributes['class'] | undefined>,
      default: () => undefined,
    },
    contentStyle: {
      type: [String, Object] as PropType<HTMLAttributes['style'] | undefined>,
      default: () => undefined,
    },
  }
}
