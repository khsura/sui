import { getCurrentInstance } from 'vue'
import { hasRawProp, resolveComponentDefault } from '@/app/lib'
import { useComponentDefaultsRepository } from '@/app/repositories'

/**
 * Wraps a component's props so every read resolves, in order:
 * explicit prop → component default (`defaults[componentName]`, legacy `components[componentName]`)
 * → `defaults.global` (only for props the component declares and is a target of) → built-in default.
 */
export const useComponentDefaultsService = <P extends object>(componentName: string, props: P): P => {
  const { getDefaults, getLegacyComponents } = useComponentDefaultsRepository()
  const instance = getCurrentInstance()

  return new Proxy(props, {
    get(target, key) {
      if (typeof key !== 'string') {
        return Reflect.get(target, key)
      }

      // vnode.props holds the raw props as the parent wrote them (before Vue defaults and
      // boolean coercion), so presence here means the parent set it explicitly — it wins.
      if (hasRawProp(instance?.vnode.props ?? {}, key)) {
        return Reflect.get(target, key)
      }

      const resolved = resolveComponentDefault({
        defaults: getDefaults(),
        legacyComponents: getLegacyComponents(),
        componentName,
        propName: key,
        hasProp: key in target,
      })

      return resolved.found ? resolved.value : Reflect.get(target, key)
    },
  })
}
