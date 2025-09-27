import { nextTick } from 'vue'
import { z } from 'zod'
import { getWindow, retry } from '@khsura/sui/lib'
import { cssVariables } from '@khsura/sui/constants'

export const useBackgroundScrollService = () => {
  const enableBackgroundScrollOnce = async () => {
    const window = getWindow()
    const html = window?.document.querySelector<HTMLElement>('html')

    await nextTick()

    const overlays = window?.document.querySelectorAll(
      '.s_dialog__content--active, .s_navigationDrawer--active.s_navigationDrawer--mobile',
    )

    const activeCount = overlays?.length ?? 0

    if (activeCount > 0) {
      return false
    }

    if (activeCount === 0 && html) {
      const scrollXProperty = html.style.getPropertyValue(cssVariables.bodyScrollX).replace('px', '')
      const scrollYProperty = html.style.getPropertyValue(cssVariables.bodyScrollY).replace('px', '')

      if (scrollXProperty === '' || scrollYProperty === '') {
        return
      }

      const x = z.coerce.number().parse(scrollXProperty)
      const y = z.coerce.number().parse(scrollYProperty)

      html.style.setProperty(cssVariables.bodyScrollX, null)
      html.style.setProperty(cssVariables.bodyScrollY, null)
      html.classList.remove('s_overlay__scrollBlocked')

      await nextTick()

      window?.scrollTo({ left: -1 * x, top: -1 * y, behavior: 'instant' })
    }

    return true
  }

  const enableBackgroundScroll = async () => {
    await retry(enableBackgroundScrollOnce, 50, 20)
  }

  const disableBackgroundScroll = async () => {
    await nextTick()

    // must be called inside for ssr
    const window = getWindow()
    const html = window?.document.querySelector<HTMLElement>('html')

    if (html && window) {
      html.style.setProperty(cssVariables.bodyScrollX, `-${window?.scrollX}px`)
      html.style.setProperty(cssVariables.bodyScrollY, `-${window?.scrollY}px`)
      await nextTick()
      html.classList.add('s_overlay__scrollBlocked')
    }
  }

  return {
    enableBackgroundScroll,
    disableBackgroundScroll,
  }
}
