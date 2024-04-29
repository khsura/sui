import { type PropType } from 'vue'

export const propsVariant = <T extends 'fab' | 'text' | 'icon'>(defaults?: { variant?: T }) => {
  return {
    variant: {
      type: String as unknown as PropType<T | null | undefined>,
      default: defaults?.variant,
    },
  } as const
}
