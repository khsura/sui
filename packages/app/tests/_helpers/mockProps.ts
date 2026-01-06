import { type Mutable } from '@vueuse/core'
import { merge } from '@/app/vendors/merge'

export const useMockProps = <T extends Record<string, unknown>>(defaultValue: Mutable<T>) => {
  return (overwrite?: ((data: T) => Partial<T>) | Partial<T>) => {
    if (typeof overwrite === 'function') {
      const props = { ...defaultValue }

      return overwrite ? merge(props, overwrite(props)) : props
    }

    return overwrite ? merge(defaultValue, overwrite) : defaultValue
  }
}
