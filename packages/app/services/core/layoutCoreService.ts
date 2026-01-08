import { computed } from 'vue'
import { ProviderName } from '@/app/configs'
import { type AppState, type PropsLayout, type PropsLayoutProvider } from '@/app/definitions'
import { getPluginName } from '@/app/lib/getPluginName'

export const useLayoutCoreService = (props: PropsLayout | PropsLayoutProvider, appState?: AppState) => {
  const name = (props as PropsLayoutProvider).name ?? (props as PropsLayout).for ?? appState?.name ?? getPluginName()

  const isApp = computed(() => {
    return props.app === true || name === appState?.name
  })

  const providerName = computed(() => (isApp.value ? ProviderName.layout : `${name}Layout`))

  return {
    providerName,
    isApp,
  }
}
