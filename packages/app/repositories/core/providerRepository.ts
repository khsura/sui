import { computed, inject as Inject, provide as Provide } from 'vue'
import { type ComputedRef, type InjectionKey } from 'vue'
import { type ProviderName, type ProviderPropsName } from '@/app/constants'
import { type Provider, type ProviderProps } from '@/app/definitions'

export const useProviderRepository = () => {
  const provideProps = <P extends ProviderPropsName>(name: P, props: ProviderProps[P]) => {
    const computedProps = computed(() => props)

    Provide(name as unknown as InjectionKey<ComputedRef<ProviderProps[P]>>, computedProps)
  }

  function injectParentProps<P extends ProviderPropsName, D extends Partial<ProviderProps[P]>>(name: P): ComputedRef<D>
  function injectParentProps<P extends ProviderPropsName, D extends Partial<ProviderProps[P]>>(
    name: P,
    defaultValue: D,
  ): ComputedRef<D>
  function injectParentProps<P extends ProviderPropsName>(
    name: P,
    defaultValue: null,
  ): ComputedRef<ProviderProps[P] | null>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function injectParentProps<P extends ProviderPropsName>(name: P, defaultValue?: any): any {
    if (defaultValue === null) {
      return Inject(
        name,
        computed(() => null),
      )
    }

    const props = Inject(
      name,
      computed(() => {
        return defaultValue ?? {}
      }),
    )

    return props
  }

  const provide = <T extends ProviderName>(name: T, value: Provider[T]) => {
    Provide(name as unknown as InjectionKey<Provider[T]>, value)
  }

  const inject = <T extends ProviderName, D extends Provider[T] | null = null>(
    name: T,
    defaultValue: D | null = null,
  ): D extends null ? Provider[T] | null : Provider[T] => {
    return Inject(name, defaultValue) as Provider[T]
  }

  return {
    provideProps,
    injectParentProps,
    provide,
    inject,
  }
}
