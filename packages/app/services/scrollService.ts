import { hasScrollFeature } from '@/app/lib/browser'
import { scrollIntoView, smoothScrollTo, smoothElementScroll } from '@/app/lib/scroll'

export const useScrollService = () => {
  return {
    smoothScrollTo,
    scrollIntoView,
    hasScrollFeature,
    smoothElementScroll,
  }
}
