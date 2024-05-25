import { hasScrollFeature } from '@khsura/sui/lib/browser'
import { scrollIntoView, smoothScrollTo, smoothElementScroll } from '@khsura/sui/lib/scroll'

export const useScrollService = () => {
  return {
    smoothScrollTo,
    scrollIntoView,
    hasScrollFeature,
    smoothElementScroll,
  }
}
