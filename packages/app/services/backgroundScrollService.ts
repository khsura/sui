import { nextTick } from 'vue'
import { z } from 'zod'
import { getWindow } from '@khsura/sui/lib'

export const useBackgroundScrollService = () => {
  const window = getWindow()

  const enableBackgroundScroll = async () => {
    const activeCount = window?.document.querySelectorAll(
      '.s_dialog__content--active, .s_navigationDrawer--active.s_navigationDrawer--mobile',
    ).length

    const html = window?.document.querySelector<HTMLElement>('html')

    if (activeCount === 1 && html) {
      const x = z.coerce.number().parse(html.style.getPropertyValue('--s-body-scroll-x').replace('px', ''))
      const y = z.coerce.number().parse(html.style.getPropertyValue('--s-body-scroll-y').replace('px', ''))

      html.style.setProperty('--s-body-scroll-x', null)
      html.style.setProperty('--s-body-scroll-y', null)
      html.classList.remove('s_overlay__scrollBlocked')

      await nextTick()

      window?.scrollTo({ left: -1 * x, top: -1 * y, behavior: 'instant' })
    }
  }

  const disableBackgroundScroll = () => {
    const html = window?.document.querySelector<HTMLElement>('html')

    if (html && window) {
      html.style.setProperty('--s-body-scroll-x', `-${window?.scrollX}px`)
      html.style.setProperty('--s-body-scroll-y', `-${window?.scrollY}px`)
      html.classList.add('s_overlay__scrollBlocked')
    }
  }

  return {
    enableBackgroundScroll,
    disableBackgroundScroll,
  }
}
