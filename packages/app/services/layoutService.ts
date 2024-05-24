import { defaultLayoutSizes } from '@sui/app/constants/layout'
import { type PropsLayout } from '@sui/app/definitions'
import { getNumericCssAttribute } from '@sui/app/lib'
import { computed, inject } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'

export const useLayoutService = (props: PropsLayout) => {
  const { isApp, providerName } = useLayoutCoreService(props)

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
