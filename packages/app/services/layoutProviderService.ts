import { defaultLayoutSizes } from '@sui/app/constants/layout'
import { type PropsLayoutProvider } from '@sui/app/definitions'
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
