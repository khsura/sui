import { useBreakpoints, useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { store } from '@khsura/sui/store'
import { type DisplayBreakpointThresholds } from '@khsura/sui/types'
import { useAppProviderService } from './appProviderService'

export const useDisplayService = (thresholds?: DisplayBreakpointThresholds) => {
  const { config } = useAppProviderService()
  const breakpoints = useBreakpoints(thresholds ?? config.display.thresholds)
  const lgAndDown = breakpoints.smallerOrEqual('lg')
  const lgAndUp = breakpoints.greaterOrEqual('lg')
  const mdAndDown = breakpoints.smallerOrEqual('md')
  const mdAndUp = breakpoints.greaterOrEqual('md')
  const mobile = breakpoints.smallerOrEqual('sm')
  const active = breakpoints.active()
  const name = computed(() => active.value || 'xs')
  const smAndDown = breakpoints.smallerOrEqual('sm')
  const smAndUp = breakpoints.greaterOrEqual('sm')
  const xs = breakpoints.smaller('sm')
  const sm = breakpoints.between('sm', 'md')
  const md = breakpoints.between('md', 'lg')
  const lg = breakpoints.between('lg', 'xl')
  const xl = breakpoints.between('xl', 'xxl')
  const xxl = breakpoints.greaterOrEqual('xxl')

  const width = computed(() => {
    return store.width
  })

  const height = computed(() => {
    return store.height
  })

  const isHoverUnsupported = useMediaQuery('(hover: none)')
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const isTouchDevice = computed(() => isHoverUnsupported.value || isCoarsePointer.value)

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    lgAndDown,
    lgAndUp,
    mdAndDown,
    mdAndUp,
    mobile,
    active,
    name,
    smAndDown,
    smAndUp,
    width,
    height,
    isTouchDevice,
  }
}
