import { provide, ref } from 'vue'
import { defaultLayoutSizes } from '~/constants/layout'
import { type PropsLayoutProvider } from '~/definitions'
import { useLayoutCoreService } from './core/layoutCoreService'

export const useLayoutProviderService = (props: PropsLayoutProvider) => {
  const { providerName } = useLayoutCoreService(props)
  const layout = ref({ ...defaultLayoutSizes })

  provide(providerName.value, layout)

  return {
    layout,
  }
}
