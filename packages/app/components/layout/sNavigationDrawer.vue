<template>
  <SOverlay :disabled="!isOverlay" :scrim="isOverlay" :value="model" :transition="transitionName">
    <component
      :is="elementTag"
      ref="navigationDrawer"
      :class="classes"
      :style="styles"
      @touchstart.passive="touchstart"
      @touchend.passive="touchless ? null : touchend"
      @touchmove.passive="touchless ? null : touchmove"
      @mouseenter="touchless ? null : mouseenter"
      @mouseleave="touchless ? null : mouseleave"
    >
      <slot name="prepend" class="s_navigationDrawer__prepend"></slot>
      <div class="s_navigationDrawer__content"><slot :on="on"></slot></div>
      <slot name="append" class="s_navigationDrawer__append"></slot>
    </component>
  </SOverlay>
</template>
<script setup lang="ts">
import { type Ref, computed, ref, getCurrentInstance, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import SOverlay from '@khsura/sui/components/sOverlay.vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import {
  useBackgroundScrollService,
  useDisplayService,
  useElevationService,
  useLayoutService,
  useLocationService,
  usePositionService,
  useProviderService,
  useResizeService,
  useScrollableService,
  useTouchService,
  useNavigationDrawerService,
} from '@khsura/sui/services'
import { type TouchWrapper } from '@khsura/sui/types'
import { onClickOutside } from '@vueuse/core'
import type { PropsNavigationDrawer } from '@khsura/sui/definitions'

const props = defineProps<PropsNavigationDrawer>()
const { isBottom, isRight, computedLocation } = useLocationService(props)

const emit = defineEmits<{
  (event: 'transitionend', value: Event): void
  (event: 'update:miniVariant', value: boolean): void
}>()

const navigationDrawer: Ref<HTMLElement | null> = ref(null)
const isMouseover = ref(false)

const model = defineModel<boolean>({
  get: (value) => {
    if (isPermanentDesktopApp.value) {
      return true
    }

    return value
  },
})

const swipeLeft = (e: TouchWrapper) => {
  if (model.value && isRight.value) {
    return
  }

  calculateTouchArea()

  if (Math.abs(e.touchendX - e.touchstartX) < 100) {
    return
  }

  if (isRight.value && e.touchstartX >= touchArea.value.right) {
    model.value = true

    return
  }

  if (!isRight.value && model.value) {
    model.value = false
  }
}

const swipeRight = (e: TouchWrapper) => {
  if (model.value && !isRight.value) {
    return
  }

  calculateTouchArea()

  if (Math.abs(e.touchendX - e.touchstartX) < 100) {
    return
  }

  if (!isRight.value && e.touchstartX <= touchArea.value.left) {
    model.value = true

    return
  }

  if (isRight.value && model.value) {
    model.value = false
  }
}

const { provideProps } = useProviderService()
const { mdAndUp } = useDisplayService()
const { app, isApp } = useLayoutService(props)
const { classListElevation } = useElevationService(props)
const { isAbsolutePosition, isFixedPosition, classListPosition } = usePositionService(props)
const { currentScroll } = useScrollableService()
const { enableBackgroundScroll, disableBackgroundScroll } = useBackgroundScrollService()
const { elementTag, elementHeight, computedActivatorElement } = useNavigationDrawerService(props)

const { touchstart, touchend, touchmove } = useTouchService({
  left: swipeLeft,
  right: swipeRight,
})

const { bindResizer, unbindResizer } = useResizeService(() => {
  model.value = !isMobile.value
})

provideProps(ProviderPropsName.navigationDrawerProps, props)

const touchArea = ref({
  left: 0,
  right: 0,
})

const isMobile = computed(() => {
  return !mdAndUp.value || isBottom.value || props.forceMobile
})

const isDesktopApp = computed(() => {
  return isApp.value && !isMobile.value
})

const isPermanentDesktopApp = computed(() => {
  return props.permanent && isDesktopApp.value && !isBottom.value
})

const isOverlay = computed((): boolean => {
  if (!isDesktopApp.value) {
    return false
  }

  return !props.hideOverlay && isMobile.value
})

const isMiniVariant = computed(() => {
  return (!props.expandOnHover && props.miniVariant) || (props.expandOnHover && !isMouseover.value)
})

const computedSubtractHeight = computed((): number | null => {
  if (!isDesktopApp.value) {
    return 0
  }

  return appHorizontalShiftWidth.value ? 0 : app.value.appBarHeight + app.value.footerHeight
})

const computedTop = computed(() => {
  const top = Math.max(app.value.offsetTop - currentScroll.value, 0)

  if (!isDesktopApp.value) {
    return top
  }

  if (appHorizontalShiftWidth.value) {
    return top
  }

  return app.value.appBarHeight + top
})

const computedWidth = computed(() => {
  const width = Number(isMiniVariant.value ? props.miniVariantWidth : props.width)

  return Number.isNaN(width) ? 256 : width
})

const computedTransform = computed((): number => {
  if (model.value) {
    return 0
  }

  if (isBottom.value) {
    return 100
  }

  return isRight.value ? 100 : -100
})

const calculateTouchArea = () => {
  const parent = getCurrentInstance()?.proxy?.$el.parentNode as Element

  if (!parent) {
    return
  }

  const parentRect = parent.getBoundingClientRect()

  touchArea.value = {
    left: parentRect.left + 50,
    right: parentRect.right - 50,
  }
}

const classes = computed(() => {
  return {
    ...classListElevation.value,
    ...classListPosition.value,
    s_navigationDrawer: true,
    's_navigationDrawer--active': model.value,
    's_navigationDrawer--absolute': isAbsolutePosition.value || !isApp.value,
    's_navigationDrawer--fixed': isFixedPosition.value || isApp.value,
    's_navigationDrawer--bottom': isBottom.value,
    's_navigationDrawer--isMobile': isMobile.value,
    's_navigationDrawer--isMouseover': isMouseover.value,
    's_navigationDrawer--miniVariant': isMiniVariant.value,
    's_navigationDrawer--customMiniVariant': Number(props.miniVariantWidth) !== 56,
    's_navigationDrawer--openOnHover': props.expandOnHover,
    's_navigationDrawer--right': isRight.value,
  }
})

const styles = computed((): object => {
  const translate = isBottom.value ? 'translateY' : 'translateX'

  const maxHeight = isBottom.value
    ? '50vh'
    : computedSubtractHeight.value != null
      ? `calc(100% - ${getNumericCssAttribute(computedSubtractHeight.value)})`
      : undefined

  return {
    height: elementHeight.value,
    top: !isBottom.value ? getNumericCssAttribute(computedTop.value) : 'auto',
    maxHeight,
    transform: `${translate}(${getNumericCssAttribute(computedTransform.value, '%')})`,
    width: !model.value ? '0px' : isBottom.value ? null : getNumericCssAttribute(computedWidth.value),
  }
})

const transitions = {
  bottom: 's_transition__navigationDrawer--bottom',
  left: 's_transition__navigationDrawer--left',
  right: 's_transition__navigationDrawer--right',
} as const

const transitionName = computed(() => {
  if (computedLocation.value === 'top') {
    return transitions.left
  }

  return transitions[computedLocation.value ?? 'left']
})

onClickOutside(
  navigationDrawer,
  () => {
    model.value = false
  },
  {
    ignore: [computedActivatorElement],
  },
)

watch(
  () => model.value,
  async (value) => {
    if (isPermanentDesktopApp.value || !value) {
      await enableBackgroundScroll()
    } else {
      disableBackgroundScroll()
    }
  },
  {
    immediate: true,
  },
)

const mouseenter = () => {
  isMouseover.value = true
}

const mouseleave = () => {
  isMouseover.value = false
}

const transitionend = (e: Event) => {
  if (e.target !== e.currentTarget) {
    return
  }

  emit('transitionend', e)

  const resizeEvent = new Event('resize')

  window.dispatchEvent(resizeEvent)
}

const click = () => {
  if (props.miniVariant) {
    emit('update:miniVariant', false)
  }
}

const updateMiniVariant = (val: boolean) => {
  if (props.expandOnHover && props.miniVariant !== val) {
    emit('update:miniVariant', val)
  }
}

watch(() => props.expandOnHover, updateMiniVariant)

watch(
  () => props.permanent && isDesktopApp.value,
  () => {
    model.value = true
  },
)

watch(isMouseover, (value) => {
  updateMiniVariant(!value)
})

watch(isMobile, (value, previous) => {
  if (previous == null || isBottom.value) {
    return
  }

  model.value = !value
})

const appHorizontalShiftWidth = computed(() => {
  if (isPermanentDesktopApp.value) {
    return computedWidth.value
  }

  if (!model.value || isMobile.value || isBottom.value) {
    return 0
  }

  return computedWidth.value
})

const appLeftShiftWidth = computed(() => {
  return isRight.value ? 0 : appHorizontalShiftWidth.value
})

const appRightShiftWidth = computed(() => {
  return isRight.value ? appHorizontalShiftWidth.value : 0
})

watch(
  [appLeftShiftWidth, appRightShiftWidth],
  ([left, right]) => {
    app.value.left = left
    app.value.right = right
  },
  {
    immediate: true,
  },
)

const on = {
  click,
  transitionend,
  mouseenter,
  mouseleave,
}

onBeforeMount(() => {
  bindResizer()
})

onBeforeUnmount(() => {
  unbindResizer()
  app.value.left = 0
  app.value.right = 0
})
</script>

<style lang="scss">
$s_navigationDrawerMobileTemporaryElevation: 16 !default;

@keyframes s-animation-navigation-drawer-left {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0%);
  }
}

@keyframes s-animation-navigation-drawer-right {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(0%);
  }
}

@keyframes s-animation-navigation-drawer-bottom {
  0% {
    transform: translateY(110%);
  }

  100% {
    transform: translateY(0%);
  }
}

$s_navigationDrawerOverlayTransitionAnimations: (
  'left': s-animation-navigation-drawer-left,
  'right': s-animation-navigation-drawer-right,
  'bottom': s-animation-navigation-drawer-bottom,
);

@each $location, $animation in $s_navigationDrawerOverlayTransitionAnimations {
  .s_transition__navigationDrawer--#{$location} {
    &-enter-active {
      animation: $animation $s_layoutTransitionDuration;
    }

    &-leave-active {
      animation: $animation $s_layoutTransitionDuration reverse;
    }
  }
}

.s_navigationDrawer {
  @include s_layoutTransition();
  @include s_elevation(1);
  top: 0;
  left: 0;
  display: flex;
  flex: 0;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
  pointer-events: auto;
  user-select: none;
  background-color: s_getAppColor('card');
  -webkit-overflow-scrolling: touch;

  .s_navigationDrawer__content {
    height: 100%;
    overflow: hidden auto;
  }

  .s_navigationDrawer__image {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    contain: strict;

    .s_image {
      border-radius: inherit;
    }
  }

  &--absolute {
    position: absolute;
    z-index: 1;
  }

  &--bottom.s_navigationDrawer--isMobile {
    top: auto;
    bottom: 0;
    min-width: 100%;
    max-height: 50%;
  }

  &--fixed {
    position: fixed;
    z-index: 6;
  }

  &--isMobile {
    z-index: 6;
  }

  &--miniVariant {
    overflow: hidden;

    .s_listItem {
      display: flex;
      justify-content: center;
      padding: 0;

      > *:first-of-type {
        margin-right: 0;
        margin-left: 0;
      }

      > *:not(:first-of-type) {
        @include s_visuallyHidden();
      }
    }

    &.s_navigationDrawer--customMiniVariant .s_listItem {
      justify-content: center;
    }
  }

  &--right {
    right: 0;
    left: auto;
  }

  &--mobile {
    &:not(.s_navigationDrawer--close) {
      @include s_elevation($s_navigationDrawerMobileTemporaryElevation);
    }
  }

  &--bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    max-height: 50vh;
  }
}
</style>
