import { provide, ref } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'
import { defaultLayoutSizes } from '@/app/constants/layout'
import { type AppState, type PropsLayoutProvider } from '@/app/definitions'

export const useLayoutProviderService = (props: PropsLayoutProvider, appState: AppState) => {
  const { providerName } = useLayoutCoreService(props, appState)
  const layout = ref({ ...defaultLayoutSizes })

  provide(providerName.value, layout)

  return {
    layout,
  }
}
