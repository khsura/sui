import { computed } from 'vue'
import { ProviderName } from '@/app/configs'
import { type PropsLayout, type PropsLayoutProvider } from '@/app/definitions'
import { useAppProviderRepository } from '@/app/repositories'

export const useLayoutCoreService = (props: PropsLayout | PropsLayoutProvider) => {
  const { config } = useAppProviderRepository()

  const isApp = computed(() => {
    return (
      props.app === true ||
      (props as PropsLayoutProvider).name === config.name ||
      (props as PropsLayout).for === config.name
    )
  })

  const name = (props as PropsLayoutProvider).name ?? (props as PropsLayout).for ?? config.name
  const providerName = computed(() => (isApp.value ? ProviderName.app : `${name}Layout`))

  return {
    providerName,
    isApp,
  }
}
