import { type Position } from '@khsura/sui/constants'
import { type PropType } from 'vue'

export const propsPosition = <T extends Position = Position>(defaults?: { position?: null | T }) => {
  return {
    position: {
      type: String as unknown as PropType<T | undefined | null>,
      default: defaults?.position !== undefined ? defaults.position : undefined,
    },
  } as const
}
