import { type Mutable } from '@vueuse/core'
import lodash from 'lodash'

export const useMockProps = <T extends Record<string, unknown>>(defaultValue: Mutable<T>) => {
  return (overwrite?: ((data: T) => Partial<T>) | Partial<T>) => {
    if (typeof overwrite === 'function') {
      const props = { ...defaultValue }

      return overwrite ? lodash.merge(props, overwrite(props)) : props
    }

    return overwrite ? lodash.merge(defaultValue, overwrite) : defaultValue
  }
}
