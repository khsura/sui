import { getCurrentInstance } from 'vue'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'

export const useComponentDefaultsService = <P extends object>(componentName: string, props: P): P => {
  const { appState } = useAppProviderRepository()
  const instance = getCurrentInstance()

  return new Proxy(props, {
    get(target, key) {
      if (typeof key !== 'string') {
        return target[key as keyof P]
      }

      const componentDefaults = (appState.components?.[componentName] ?? {}) as Partial<P>

      if (!(key in componentDefaults)) {
        return target[key as keyof P]
      }

      // If the parent explicitly passed this prop, their value wins.
      // vnode.props holds the raw props as provided by the parent (before Vue defaults),
      // so checking presence here correctly handles boolean coercion edge cases.
      const vnodeProps = instance?.vnode.props ?? {}

      if (key in vnodeProps) {
        return target[key as keyof P]
      }

      return componentDefaults[key as keyof P]
    },
  }) as P
}
