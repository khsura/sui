import { defaultLayoutSizes } from '@khsura/sui/constants/layout'
import { type PropsLayoutProvider } from '@khsura/sui/definitions'
import { provide, ref } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'

export const useLayoutProviderService = (props: PropsLayoutProvider) => {
  const { providerName } = useLayoutCoreService(props)
  const layout = ref({ ...defaultLayoutSizes })

  provide(providerName.value, layout)

  return {
    layout,
  }
}
