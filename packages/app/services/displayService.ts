/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { breakpoints } from '@sui/app/constants'
import { ref, computed, onMounted } from 'vue'
import { useAppProviderService } from './appProviderService'
import { useMediaQuery } from '@vueuse/core'

export const useDisplayService = () => {
  const { config } = useAppProviderService()
  const isLoaded = ref(false)

  const getValue = <T>(value: T) => {
    return isLoaded.value ? value : null
  }

  const xs = computed(() => {
    return getValue(config.display.width < config.display.thresholds.xs)
  })

  const sm = computed(() => {
    return getValue(config.display.width < config.display.thresholds.sm && !xs.value)
  })

  const md = computed(() => {
    return getValue(
      config.display.width < config.display.thresholds.md - config.display.scrollBarWidth && !(sm.value || xs.value),
    )
  })

  const lg = computed(() => {
    return getValue(
      config.display.width < config.display.thresholds.lg - config.display.scrollBarWidth &&
        !(md.value || sm.value || xs.value),
    )
  })

  const xl = computed(() => {
    return getValue(config.display.width >= config.display.thresholds.lg - config.display.scrollBarWidth)
  })

  const xsOnly = computed(() => {
    return xs.value
  })

  const smOnly = computed(() => {
    return sm.value
  })

  const smAndDown = computed(() => {
    return getValue((xs.value || sm.value) && !(md.value || lg.value || xl.value))
  })

  const smAndUp = computed(() => {
    return getValue(!xs.value && (sm.value || md.value || lg.value || xl.value))
  })

  const mdOnly = computed(() => {
    return md.value
  })

  const mdAndDown = computed(() => {
    return getValue((xs.value || sm.value || md.value) && !(lg.value || xl.value))
  })

  const mdAndUp = computed(() => {
    return getValue(!(xs.value || sm.value) && (md.value || lg.value || xl.value))
  })

  const lgOnly = computed(() => {
    return lg.value
  })

  const lgAndDown = computed(() => {
    return getValue((xs.value || sm.value || md.value || lg.value) && !xl.value)
  })

  const lgAndUp = computed(() => {
    return getValue(!(xs.value || sm.value || md.value) && (lg.value || xl.value))
  })

  const xlOnly = computed(() => {
    return xl.value
  })

  const name = computed(() => {
    if (!isLoaded.value) {
      return null
    }

    if (xs.value) {
      return 'xs'
    }

    if (sm.value) {
      return 'sm'
    }

    if (lg.value) {
      return 'lg'
    }

    if (xl.value) {
      return 'xl'
    }

    return null
  })

  const mobile = computed(() => {
    if (!name.value) {
      return null
    }

    if (typeof config.display.mobileBreakpoint === 'number') {
      return config.display.width < parseInt(config.display.mobileBreakpoint.toString(), 10)
    }

    const current = breakpoints[name.value]
    const max = breakpoints[config.display.mobileBreakpoint]

    return current <= max
  })

  const width = computed(() => {
    return getValue(config.display.width)
  })

  const height = computed(() => {
    return getValue(config.display.height)
  })

  const isHoverUnsupported = useMediaQuery('(hover: none)')
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const isTouchDevice = computed(() => getValue(isHoverUnsupported.value) || getValue(isCoarsePointer.value))

  onMounted(() => {
    isLoaded.value = true
  })

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xsOnly,
    smOnly,
    smAndDown,
    smAndUp,
    mdOnly,
    mdAndDown,
    mdAndUp,
    lgOnly,
    lgAndDown,
    lgAndUp,
    xlOnly,
    name,
    mobile,
    width,
    height,
    isTouchDevice,
  }
}
