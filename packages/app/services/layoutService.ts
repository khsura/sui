import { computed, inject } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'
import { defaultLayoutSizes } from '@/app/constants/layout'
import { type PropsLayout } from '@/app/definitions'
import { getNumericCssAttribute } from '@/app/lib'
import { ProviderName } from '@/app/configs'

export const useLayoutService = (props: PropsLayout) => {
  const appState = inject(ProviderName.app)
  const { isApp, providerName } = useLayoutCoreService(props, appState)

  const app = inject(
    providerName.value,
    computed(() => ({ ...defaultLayoutSizes })),
  )

  const left = computed(() => getNumericCssAttribute(app.value.left))
  const right = computed(() => getNumericCssAttribute(app.value.right))
  const width = computed(() => `calc(100% - ${app.value.left + app.value.right}px)`)

  return {
    app,
    isApp,
    left,
    right,
    width,
  }
}
