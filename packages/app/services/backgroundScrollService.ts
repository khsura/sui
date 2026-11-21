import { getCurrentScope, onScopeDispose } from 'vue'
import { getWindow } from '@/app/lib'
import { cssVariables, overlayScrollBlockedClassName } from '@/app/constants'
import { scrollLockOwners } from '@/app/store'

const getHtml = () => getWindow()?.document.documentElement ?? null

// Pins the page where it is: the html element becomes position: fixed, offset by the current scroll.
const lockPage = () => {
  const window = getWindow()
  const html = getHtml()

  if (!window || !html || html.classList.contains(overlayScrollBlockedClassName)) {
    return
  }

  html.style.setProperty(cssVariables.bodyScrollX, `-${window.scrollX}px`)
  html.style.setProperty(cssVariables.bodyScrollY, `-${window.scrollY}px`)
  html.classList.add(overlayScrollBlockedClassName)
}

// Releases the page and scrolls back to where it was pinned.
const unlockPage = () => {
  const window = getWindow()
  const html = getHtml()

  if (!window || !html || !html.classList.contains(overlayScrollBlockedClassName)) {
    return
  }

  const left = -Number.parseFloat(html.style.getPropertyValue(cssVariables.bodyScrollX)) || 0
  const top = -Number.parseFloat(html.style.getPropertyValue(cssVariables.bodyScrollY)) || 0

  html.style.removeProperty(cssVariables.bodyScrollX)
  html.style.removeProperty(cssVariables.bodyScrollY)
  html.classList.remove(overlayScrollBlockedClassName)
  window.scrollTo({ left, top, behavior: 'instant' })
}

/**
 * Blocks the page scroll behind a modal overlay. Each caller is one lock owner; the page stays pinned while any
 * owner holds a lock and is released when the last one lets go. Both calls are idempotent and apply at once, so
 * a drawer that turns mobile and closes in the same tick (a window resize across the md breakpoint) ends unlocked
 * whatever order its watchers ran in. An owner created inside a component lets go when the component unmounts.
 */
export const useBackgroundScrollService = () => {
  const owner = Symbol('backgroundScrollOwner')

  const disableBackgroundScroll = () => {
    scrollLockOwners.add(owner)
    lockPage()
  }

  const enableBackgroundScroll = () => {
    if (!scrollLockOwners.delete(owner)) {
      return
    }

    if (scrollLockOwners.size === 0) {
      unlockPage()
    }
  }

  if (getCurrentScope()) {
    onScopeDispose(enableBackgroundScroll)
  }

  return {
    enableBackgroundScroll,
    disableBackgroundScroll,
  }
}
