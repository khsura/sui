import { computed, inject } from 'vue'
import { useLayoutCoreService } from './core/layoutCoreService'
import { defaultLayoutSizes } from '@/app/constants/layout'
import { type PropsLayout } from '@/app/definitions'
import { getLengthWithSafeArea, getNumericCssAttribute } from '@/app/lib'
import { ProviderName } from '@/app/configs'

export const useLayoutService = (props: PropsLayout) => {
  const appState = inject(ProviderName.app)
  const { isApp, providerName } = useLayoutCoreService(props, appState)

  const app = inject(
    providerName.value,
    computed(() => ({ ...defaultLayoutSizes })),
  )

  // A permanent drawer widens by its side's safe-area inset (iPhone landscape), so the layout shifts by it as well.
  const left = computed(() => {
    const leftWidth = getNumericCssAttribute(app.value.left)

    return app.value.hasLeftSafeArea ? getLengthWithSafeArea(leftWidth, 'left') : leftWidth
  })

  const right = computed(() => {
    const rightWidth = getNumericCssAttribute(app.value.right)

    return app.value.hasRightSafeArea ? getLengthWithSafeArea(rightWidth, 'right') : rightWidth
  })

  const width = computed(() => {
    if (!app.value.hasLeftSafeArea && !app.value.hasRightSafeArea) {
      return `calc(100% - ${app.value.left + app.value.right}px)`
    }

    return `calc(100% - ${left.value} - ${right.value})`
  })

  return {
    app,
    isApp,
    left,
    right,
    width,
  }
}
