import { type PropType } from 'vue'

export const propsPosition = <
  T extends 'fixed' | 'absolute' | 'relative' = 'fixed' | 'absolute' | 'relative',
>(defaults?: {
  position?: null | T
}) => {
  return {
    position: {
      type: String as unknown as PropType<T | undefined | null>,
      default: defaults?.position !== undefined ? defaults.position : undefined,
    },
  } as const
}
