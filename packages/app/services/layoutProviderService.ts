import { provide, ref } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'
import { defaultLayoutSizes } from '@/app/constants/layout'
import { type PropsLayoutProvider } from '@/app/definitions'

export const useLayoutProviderService = (props: PropsLayoutProvider) => {
  const { providerName } = useLayoutCoreService(props)
  const layout = ref({ ...defaultLayoutSizes })

  provide(providerName.value, layout)

  return {
    layout,
  }
}
