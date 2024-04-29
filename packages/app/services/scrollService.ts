import { hasScrollFeature } from '@sui/app/lib/browser'
import { scrollIntoView, smoothScrollTo, smoothElementScroll } from '@sui/app/lib/scroll'

export const useScrollService = () => {
  return {
    smoothScrollTo,
    scrollIntoView,
    hasScrollFeature,
    smoothElementScroll,
  }
}
