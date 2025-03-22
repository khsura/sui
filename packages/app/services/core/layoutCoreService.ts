import { computed } from 'vue'
import { ProviderName } from '@khsura/sui/constants'
import { type PropsLayout, type PropsLayoutProvider } from '@khsura/sui/definitions'

export const useLayoutCoreService = (props: PropsLayout | PropsLayoutProvider) => {
  const isApp = computed(() => {
    return (
      props.app === true ||
      (props as PropsLayoutProvider).name === ProviderName.app ||
      (props as PropsLayout).for === ProviderName.app
    )
  })

  const name = (props as PropsLayoutProvider).name ?? (props as PropsLayout).for ?? ProviderName.app
  const providerName = computed(() => (isApp.value ? ProviderName.app : `${name}Layout`))

  return {
    providerName,
    isApp,
  }
}
