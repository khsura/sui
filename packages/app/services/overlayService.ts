import { type PropsOverlay } from '@sui/app/definitions'
import { getDocument } from '@sui/app/lib/browser'
import { ref, onMounted } from 'vue'

export const useOverlayService = (props: PropsOverlay) => {
  const isReady = ref(false)

  onMounted(() => {
    const targetElement = getDocument()?.querySelector('.s_app')
    let container = targetElement?.querySelector(props.teleportTo)

    if (!container) {
      container = document.createElement('div')
      container.className = 's_overlayContainer'
      targetElement?.appendChild(container)
    }

    isReady.value = true
  })

  return {
    isReady,
  }
}
