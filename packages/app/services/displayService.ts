import { useBreakpoints, useMediaQuery } from '@vueuse/core'
import { computed, inject } from 'vue'
import { store } from '@/app/store'
import { type DisplayBreakpointThresholds } from '@/app/types'
import { thresholds as defaultThresholds } from '@/app/configs/core/breakpoint'
import { getPluginName } from '@/app/lib/getPluginName'
import type { AppState } from '@/app/definitions'

export const useDisplayService = ({
  thresholds,
  appName,
}: {
  thresholds?: DisplayBreakpointThresholds
  appName?: string | symbol
} = {}) => {
  const appState = inject<AppState>(getPluginName(appName))

  if (!appState) {
    throw new Error(`AppState for ${appName?.toString()} not found`)
  }

  const breakpoints = useBreakpoints(thresholds ?? appState?.display.thresholds ?? defaultThresholds)
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
