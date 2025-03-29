import { hasScrollFeature } from '~/lib/browser'
import { scrollIntoView, smoothScrollTo, smoothElementScroll } from '~/lib/scroll'

export const useScrollService = () => {
  return {
    smoothScrollTo,
    scrollIntoView,
    hasScrollFeature,
    smoothElementScroll,
  }
}
