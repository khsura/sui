<template>
  <Transition name="s_transition--appear">
    <div v-if="isLayoutScrim" class="s_navigationDrawer__scrim" @click="closeOnOutsideClick"></div>
  </Transition>
  <SOverlay
    :disabled="!isOverlay"
    :scrim="isOverlay"
    :value="model"
    :transition="transitionName"
    @click:scrim="closeOnOutsideClick"
  >
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
      <div ref="drawerContentElement" class="s_navigationDrawer__content" :tabindex="scrollableTabindex">
        <slot :on="on"></slot>
      </div>
      <slot name="append" class="s_navigationDrawer__append"></slot>
      <div
        v-if="isResizable"
        class="s_navigationDrawer__resizeHandle"
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        :aria-valuenow="resizedWidth"
        :aria-valuemin="resizeMinWidth"
        :aria-valuemax="resizeMaxWidth"
        @pointerdown="startResize"
        @keydown="resizeByKeyboard"
      ></div>
    </component>
  </SOverlay>
</template>
<script setup lang="ts">
import {
  type Ref,
  computed,
  ref,
  getCurrentInstance,
  watch,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  provide,
  useTemplateRef,
} from 'vue'
import { onClickOutside } from '@vueuse/core'
import SOverlay from '@/app/components/sOverlay.vue'
import { ProviderPropsName } from '@/app/configs'
import {
  navigationDrawerDefaultWidth,
  navigationDrawerEdgeSwipeZone,
  navigationDrawerSwipeMinDistance,
} from '@/app/constants'
import { getLengthWithSafeArea, getNumericCssAttribute } from '@/app/lib'
import { getIsFixedPosition } from '@/app/repositories/positionRepository'
import {
  useComponentDefaultsService,
  useBackgroundScrollService,
  useDisplayService,
  useElevationService,
  useLayoutService,
  useLocationService,
  usePositionService,
  useResizeService,
  useScrollableFocusService,
  useScrollableService,
  useTouchService,
  useNavigationDrawerService,
  useNavigationDrawerResizeService,
} from '@/app/services'
import { type TouchWrapper } from '@/app/types'
import type { PropsNavigationDrawer } from '@/app/definitions'

const rawProps = defineProps<PropsNavigationDrawer>()
const props = useComponentDefaultsService('SNavigationDrawer', rawProps)
const drawerContentElement = useTemplateRef<HTMLElement>('drawerContentElement')
// A drawer whose items overflow becomes a Tab stop, so its content can be scrolled from the keyboard.
const { scrollableTabindex } = useScrollableFocusService(drawerContentElement)
const { isBottom, isRight, computedLocation } = useLocationService(props)

const emit = defineEmits<{
  (event: 'transitionend', value: Event): void
  (event: 'update:miniVariant', value: boolean): void
  (event: 'update:width', value: number): void
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

  if (Math.abs(e.touchendX - e.touchstartX) < navigationDrawerSwipeMinDistance) {
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

  if (Math.abs(e.touchendX - e.touchstartX) < navigationDrawerSwipeMinDistance) {
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

const { mdAndUp } = useDisplayService()
const { app: layoutApp, isApp } = useLayoutService(props)
const { classListElevation } = useElevationService(props)
const { isAbsolutePosition, isFixedPosition, classListPosition } = usePositionService(props)
const { currentScroll } = useScrollableService()
const { enableBackgroundScroll, disableBackgroundScroll } = useBackgroundScrollService()
const { elementTag, elementHeight, computedActivatorElement } = useNavigationDrawerService(props)

const { touchstart, touchend, touchmove } = useTouchService({
  left: swipeLeft,
  right: swipeRight,
})

// Open beside the content on desktop and closed on mobile, on mount and on every window resize.
// A persistent drawer keeps the user's open/closed choice; the isMobile watcher still closes it on mobile.
const openForDisplay = () => {
  if (props.persistent) {
    return
  }

  model.value = !isMobile.value
}

const { bindResizer, unbindResizer } = useResizeService(openForDisplay)

provide(ProviderPropsName.navigationDrawerProps, props)

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

// A drawer over the page — a mobile one inside an app — dims what is behind it.
// It used to require isDesktopApp, which rules out mobile, so no scrim was ever drawn.
const isOverlay = computed((): boolean => {
  if (!isApp.value) {
    return false
  }

  return !props.hideOverlay && isMobile.value
})

// A mobile drawer in a named layout stays inside that layout (position: absolute), so it dims only the layout,
// with a scrim beside it. A tap there is an outside click, which closes the drawer unless it is persistent.
const isLayoutScrim = computed((): boolean => {
  return !isApp.value && !props.hideOverlay && isMobile.value && !isBottom.value && Boolean(model.value)
})

const isMiniVariant = computed(() => {
  return (!props.expandOnHover && props.miniVariant) || (props.expandOnHover && !isMouseover.value)
})

const computedSubtractHeight = computed((): number | null => {
  if (!isDesktopApp.value) {
    return 0
  }

  return appHorizontalShiftWidth.value ? 0 : layoutApp.value.appBarHeight + layoutApp.value.footerHeight
})

const computedTop = computed(() => {
  const top = Math.max(layoutApp.value.offsetTop - currentScroll.value, 0)

  if (!isDesktopApp.value) {
    return top
  }

  if (appHorizontalShiftWidth.value) {
    return top
  }

  return layoutApp.value.appBarHeight + top
})

const isResizable = computed(() => {
  return Boolean(props.resizable && model.value) && !isMobile.value && !isBottom.value && !isMiniVariant.value
})

const {
  width: resizedWidth,
  minWidth: resizeMinWidth,
  maxWidth: resizeMaxWidth,
  isResizing,
  startResize,
  resizeByKeyboard,
} = useNavigationDrawerResizeService(props, navigationDrawer, isRight, isResizable, (width) => {
  emit('update:width', width)
})

const computedWidth = computed(() => {
  if (!isMiniVariant.value) {
    return resizedWidth.value
  }

  const miniVariantWidth = Number(props.miniVariantWidth)

  return Number.isNaN(miniVariantWidth) ? navigationDrawerDefaultWidth : miniVariantWidth
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
    's_navigationDrawer--permanent': isPermanentDesktopApp.value,
    's_navigationDrawer--customMiniVariant': Number(props.miniVariantWidth) !== 56,
    's_navigationDrawer--openOnHover': props.expandOnHover,
    's_navigationDrawer--right': isRight.value,
    's_navigationDrawer--resizable': isResizable.value,
    's_navigationDrawer--resizing': isResizing.value,
  }
})

// The mobile drawer and a permanent desktop one (iPhone landscape) pad the side they sit on by that side's
// safe-area inset, and widen by it so their items keep their usual width (the inset is 0px without a safe area).
const hasSideSafeArea = computed(() => isMobile.value || isPermanentDesktopApp.value)

const openWidth = computed(() => {
  const width = getNumericCssAttribute(computedWidth.value)

  return hasSideSafeArea.value ? getLengthWithSafeArea(width, isRight.value ? 'right' : 'left') : width
})

// A desktop drawer that starts below a fixed app bar moves down by the notch padding that bar adds.
const isBelowFixedAppBar = computed(() => {
  return (
    isDesktopApp.value &&
    !appHorizontalShiftWidth.value &&
    layoutApp.value.appBarHeight > 0 &&
    getIsFixedPosition({ position: layoutApp.value.appBarPosition })
  )
})

const styles = computed((): object => {
  const translate = isBottom.value ? 'translateY' : 'translateX'
  const subtractHeight = getNumericCssAttribute(computedSubtractHeight.value)
  const top = getNumericCssAttribute(computedTop.value)

  const maxHeight = isBottom.value
    ? '50vh'
    : computedSubtractHeight.value != null
      ? `calc(100% - ${isBelowFixedAppBar.value ? getLengthWithSafeArea(subtractHeight, 'top') : subtractHeight})`
      : undefined

  return {
    height: elementHeight.value,
    top: !isBottom.value ? (isBelowFixedAppBar.value ? getLengthWithSafeArea(top, 'top') : top) : 'auto',
    maxHeight,
    transform: `${translate}(${getNumericCssAttribute(computedTransform.value, '%')})`,
    width: !model.value ? '0px' : isBottom.value ? null : openWidth.value,
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

// `persistent`: an outside click (or a tap on the scrim) never closes the drawer, on mobile as on desktop.
const closeOnOutsideClick = () => {
  if (props.persistent) {
    return
  }

  model.value = false
}

// The scrims also close the drawer through their own click listener: on iOS Safari a tap on them never
// reaches this window-level handler.
onClickOutside(navigationDrawer, closeOnOutsideClick, {
  ignore: [computedActivatorElement],
})

watch(
  [model, isMobile, isPermanentDesktopApp],
  () => {
    if (isPermanentDesktopApp.value || !isMobile.value || !model.value) {
      enableBackgroundScroll()
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

  if (props.persistent && !value) {
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

// each drawer owns only its own side, so a left and a right drawer can share one layout
const layoutSide = computed(() => (isRight.value ? 'right' : 'left'))

// the layout beside a permanent drawer shifts by the drawer's safe-area inset as well
const setLayoutSide = (side: 'left' | 'right', shiftWidth: number, hasSafeArea: boolean) => {
  layoutApp.value[side] = shiftWidth

  if (side === 'right') {
    layoutApp.value.hasRightSafeArea = hasSafeArea
  } else {
    layoutApp.value.hasLeftSafeArea = hasSafeArea
  }
}

watch(
  [layoutSide, appHorizontalShiftWidth, isPermanentDesktopApp],
  ([side, shiftWidth, isPermanent], previousValues) => {
    const previousSide = previousValues?.[0]

    if (previousSide && previousSide !== side) {
      setLayoutSide(previousSide, 0, false)
    }

    setLayoutSide(side, shiftWidth, isPermanent)
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

/**
 * Opening a closed mobile drawer by swiping in from its edge.
 *
 * The drawer's own touch listeners cannot do it: closed, the drawer is off
 * screen, so a swipe on the page never reaches it — only swipe-to-close ever
 * fired. While it is closed, the document listens instead, for a horizontal
 * swipe that starts within `navigationDrawerEdgeSwipeZone` of the drawer's
 * edge of the viewport and travels `navigationDrawerSwipeMinDistance`. The
 * zone is narrow so a table scrolling sideways keeps its swipe.
 */
const openFromEdge = (e: TouchWrapper, fromRight: boolean) => {
  if (model.value || isRight.value !== fromRight) {
    return
  }

  if (Math.abs(e.touchendX - e.touchstartX) < navigationDrawerSwipeMinDistance) {
    return
  }

  const viewportWidth = document.documentElement.clientWidth

  const startsAtEdge = fromRight
    ? e.touchstartX >= viewportWidth - navigationDrawerEdgeSwipeZone
    : e.touchstartX <= navigationDrawerEdgeSwipeZone

  if (startsAtEdge) {
    model.value = true
  }
}

const edgeTouch = useTouchService({
  left: (e) => openFromEdge(e, true),
  right: (e) => openFromEdge(e, false),
})

const listensForEdgeSwipe = computed(() => !props.touchless && isMobile.value && !model.value)

const bindEdgeSwipe = () => {
  document.addEventListener('touchstart', edgeTouch.touchstart, { passive: true })
  document.addEventListener('touchend', edgeTouch.touchend, { passive: true })
}

const unbindEdgeSwipe = () => {
  document.removeEventListener('touchstart', edgeTouch.touchstart)
  document.removeEventListener('touchend', edgeTouch.touchend)
}

onBeforeMount(() => {
  bindResizer()

  watch(listensForEdgeSwipe, (listens) => (listens ? bindEdgeSwipe() : unbindEdgeSwipe()), { immediate: true })
})

// The docs promise a drawer that opens itself on desktop; without this it only did so after the first resize.
onMounted(() => {
  if (!isBottom.value) {
    openForDisplay()
  }
})

onBeforeUnmount(() => {
  unbindResizer()
  unbindEdgeSwipe()
  setLayoutSide(layoutSide.value, 0, false)
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

.s_navigationDrawer__scrim {
  position: absolute;
  inset: 0;
  z-index: 6;
  background-color: $s_color__black;
  opacity: 0.5;
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

    &:focus-visible {
      @include s_focusRing(-2px);
    }
  }

  .s_navigationDrawer__image {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    contain: strict;
    border-radius: inherit;

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

    // the mobile drawer covers the screen edge it opens from, so it clears the notch, the home indicator and
    // that side's landscape inset (0px without a safe area)
    padding-top: s_safeAreaInset('top');
    padding-bottom: s_safeAreaInset('bottom');

    &:not(.s_navigationDrawer--right, .s_navigationDrawer--bottom) {
      padding-left: s_safeAreaInset('left');
    }

    &.s_navigationDrawer--right {
      padding-right: s_safeAreaInset('right');
    }

    &.s_navigationDrawer--bottom {
      padding-top: 0;
    }
  }

  // a permanent desktop drawer in iPhone landscape clears the notch / Dynamic Island on the side it sits on
  &--permanent {
    &:not(.s_navigationDrawer--right) {
      padding-left: s_safeAreaInset('left');
    }

    &.s_navigationDrawer--right {
      padding-right: s_safeAreaInset('right');
    }
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

  &--resizing {
    transition: none;
  }

  .s_navigationDrawer__resizeHandle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 6px;
    touch-action: none;
    cursor: col-resize;
    outline: none;

    &:hover,
    &:focus-visible {
      background-color: s_getAppColor('border');
    }
  }

  &--resizing .s_navigationDrawer__resizeHandle {
    background-color: s_getAppColor('border');
  }

  &--right .s_navigationDrawer__resizeHandle {
    right: auto;
    left: 0;
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
