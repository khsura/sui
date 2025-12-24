import type { PropsNavigationDrawer } from '@khsura/sui/definitions'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { useActivatorElementService, useLayoutCoreService } from '@khsura/sui/services/core'
import { computed } from 'vue'

export const useNavigationDrawerService = (props: PropsNavigationDrawer) => {
  const { isApp } = useLayoutCoreService(props)
  const { computedActivatorElement } = useActivatorElementService(props)

  const elementTag = computed(() => {
    if (props.tag) {
      return props.tag
    }

    return isApp.value ? 'nav' : 'aside'
  })

  const elementHeight = computed(() => {
    if (props.height !== undefined && props.height !== null) {
      return getNumericCssAttribute(props.height)
    }

    return isApp.value ? '100vh' : '100%'
  })

  return {
    elementTag,
    elementHeight,
    computedActivatorElement,
  }
}
