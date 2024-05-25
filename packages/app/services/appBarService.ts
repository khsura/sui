import { computed, reactive } from 'vue'
import { getCleanSetObject, getNumericCssAttribute, isBrowser } from '@khsura/sui/lib'
import { type ThresholdMetParams } from '@khsura/sui/types'
import { type PropsAppBar } from '@khsura/sui/definitions'
import { useScrollableService } from './scrollableService'
import { useToolbarService } from './toolbarService'
import { useLayoutService } from './layoutService'
import { usePositionService } from './positionService'

export const useAppBarService = (props: PropsAppBar) => {
  const canScroll = computed((): boolean => {
    return isBrowser() && (props.elevateOnScroll || props.hideOnScroll)
  })

  const getIsWithinScrollThreshold = (data: Pick<ThresholdMetParams, 'currentScroll' | 'computedScrollThreshold'>) => {
    return data.currentScroll < data.computedScrollThreshold
  }

  const getShouldDisplayAppBar = (
    data: Pick<ThresholdMetParams, 'currentScroll' | 'computedScrollThreshold' | 'isScrollingUp'>,
  ) => {
    if (props.hideOnScroll) {
      return data.isScrollingUp || getIsWithinScrollThreshold(data)
    }

    return true
  }

  const { app, left, right, width, isApp } = useLayoutService(props)
  const { isExtended, computedExtensionHeight, toolbarHeight } = useToolbarService(props)
  const { classListPosition, isFixedPosition, isFixedOrAbsolutePosition } = usePositionService(props)

  const { currentScroll, isActive, isScrollingUp, computedScrollThreshold } = useScrollableService(
    reactive({
      get scrollThreshold() {
        if (props.scrollThreshold !== null) {
          return Number(props.scrollThreshold)
        }

        return toolbarHeight.value
      },
      get scrollTarget() {
        return props.scrollTarget
      },
    }),
    (data) => {
      const isActive = getShouldDisplayAppBar(data)

      return {
        isActive,
        savedScroll: !isActive || getIsWithinScrollThreshold(data) ? data.savedScroll : data.currentScroll,
      }
    },
    canScroll,
  )

  const updateIsAppBarDisplayStatus = () => {
    isActive.value = getShouldDisplayAppBar({
      isScrollingUp: isScrollingUp.value,
      currentScroll: currentScroll.value,
      computedScrollThreshold: computedScrollThreshold.value,
    })
  }

  // TODO (Sura) may use this in the future
  // const scrollRatio = computed((): number => {
  //   const threshold = computedScrollThreshold.value

  //   if (threshold === 0) {
  //     return 1
  //   }

  //   return Math.max((threshold - currentScroll.value) / threshold, 0)
  // })

  const computedTransform = computed((): number => {
    if (!canScroll.value || isActive.value) {
      return 0
    }

    return -1 * toolbarHeight.value
  })

  const isWithinScrollThreshold = computed(() => {
    return getIsWithinScrollThreshold({
      currentScroll: currentScroll.value,
      computedScrollThreshold: computedScrollThreshold.value,
    })
  })

  const hideShadow = computed((): boolean => {
    if (isFixedOrAbsolutePosition.value && props.elevateOnScroll) {
      return isWithinScrollThreshold.value
    }

    return false
  })

  const isFixedAppBar = computed(() => {
    return isApp.value && isFixedPosition.value
  })

  const classes = computed(() => {
    return {
      k_appBar: true,
      'k_appBar--hideShadow': hideShadow.value,
      'k_appBar--elevateOnScroll': props.elevateOnScroll,
      'k_appBar--fixed': isFixedAppBar.value,
      k_position__fixed: isFixedAppBar.value && classListPosition.value.s_position__fixed,
      k_position__absolute: !isFixedAppBar.value && classListPosition.value.s_position__absolute,
    }
  })

  const styles = computed(() => {
    return getCleanSetObject({
      left: left.value,
      right: right.value,
      width: width.value,
      top: isFixedOrAbsolutePosition.value
        ? getNumericCssAttribute(Math.max(app.value.offsetTop - currentScroll.value, 0))
        : undefined,
      transform: `translateY(${getNumericCssAttribute(computedTransform.value)})`,
    })
  })

  return {
    computedExtensionHeight,
    isExtended,
    toolbarHeight,
    app,
    classes,
    styles,
    isFixedAppBar,
    isActive,
    updateIsAppBarDisplayStatus,
  }
}
