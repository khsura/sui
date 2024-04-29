<template>
  <SToolbar
    :tag="tag"
    :theme="theme"
    :outlined="outlined"
    :position="position"
    :class="classes"
    :style="styles"
    :color="color"
    :density="density"
    :elevation="elevation"
    :extended="extended"
    :extension-height="extensionHeight"
    :floating="floating"
    :height="height"
  >
    <slot></slot>
    <slot v-if="isExtended" name="extension"></slot>
  </SToolbar>
</template>
<script setup lang="ts">
import { SToolbar } from '@sui/app/components/toolbar'
import { isBrowser } from '@sui/app/lib/browser'
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsLayout, propsPosition, propsScrollable, propsToolbar } from '@sui/app/props'
import { useLayoutService, usePositionService, useScrollableService, useToolbarService } from '@sui/app/services'
import { computed, watch, reactive, onBeforeMount } from 'vue'

const props = defineProps({
  elevateOnScroll: {
    type: Boolean,
    default: false,
  },
  hideOnScroll: {
    type: Boolean,
    default: false,
  },
  scrollOffScreen: {
    type: Boolean,
    default: false,
  },
  shrinkOnScroll: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
  ...propsToolbar({ tag: 'header' }),
  ...propsLayout({ app: false }),
  ...propsScrollable(),
  ...propsPosition(),
})

const canScroll = computed((): boolean => {
  return isBrowser() && (props.elevateOnScroll || props.hideOnScroll || !props.modelValue)
})

const modifiedProps = reactive({
  get scrollThreshold() {
    if (props.scrollThreshold) {
      return Number(props.scrollThreshold)
    }

    return extensionHeight.value
  },
  get scrollTarget() {
    return props.scrollTarget
  },
})

const { currentScroll, isActive, isScrollingUp, computedScrollThreshold } = useScrollableService(
  modifiedProps,
  (data) => {
    const isActive = getIsActive()

    return {
      isActive,
      savedScroll:
        !isActive || data.currentScroll < data.computedScrollThreshold ? data.savedScroll : data.currentScroll,
    }
  },
  canScroll,
)

const getIsActive = () => {
  if (!props.hideOnScroll) {
    return true
  }

  return isScrollingUp.value || currentScroll.value < computedScrollThreshold.value
}

const { app, left, right } = useLayoutService(props)
const { classListPosition, isFixedPosition } = usePositionService(props)
const { isExtended, contentHeight: toolbarContentHeight, extensionHeight, toolbarHeight } = useToolbarService(props)

const classes = computed(() => {
  return {
    ...classListPosition.value,
    s_appBar: true,
    's_appBar--hideShadow': hideShadow.value,
    's_appBar--elevateOnScroll': props.elevateOnScroll,
    's_appBar--isScrolled': currentScroll.value > 0,
    's_appBar--fixed': isFixedPosition.value,
  }
})

const scrollRatio = computed((): number => {
  const threshold = computedScrollThreshold.value

  if (threshold === 0) {
    return 1
  }

  return Math.max((threshold - currentScroll.value) / threshold, 0)
})

const computedContentHeight = computed((): number => {
  if (!props.shrinkOnScroll) {
    return toolbarContentHeight.value
  }

  const min = toolbarContentHeight.value
  const max = toolbarHeight.value

  return min + (max - min) * scrollRatio.value
})

const computedFontSize = computed((): number | undefined => {
  if (!props.shrinkOnScroll) {
    return undefined
  }

  const min = 1.25
  const max = 1.5

  return min + (max - min) * scrollRatio.value
})

const computedOpacity = computed((): number | undefined => {
  return 1 // props.hideOnScroll ? scrollRatio.value : 1
})

const computedTransform = computed((): number => {
  if (!canScroll.value || (props.elevateOnScroll && currentScroll.value === 0 && isActive.value)) {
    return 0
  }

  if (isActive.value) {
    return 0
  }

  const transformHeight = props.scrollOffScreen ? toolbarHeight.value : computedContentHeight.value

  return transformHeight
})

const hideShadow = computed((): boolean => {
  if (props.elevateOnScroll && isExtended.value) {
    return currentScroll.value < computedScrollThreshold.value
  }

  if (props.elevateOnScroll) {
    return currentScroll.value === 0 || computedTransform.value < 0
  }

  return (!isExtended.value || props.scrollOffScreen) && computedTransform.value !== 0
})

const styles = computed(() => {
  return {
    opacity: computedOpacity.value,
    fontSize: getNumericCssAttribute(computedFontSize.value, 'rem'),
    transform: `translateY(${getNumericCssAttribute(computedTransform.value)})`,
    left: left.value,
    right: right.value,
  }
})

watch(
  [computedTransform],
  () => {
    if (!canScroll.value) {
      return
    }

    app.value.top = toolbarHeight.value + computedTransform.value
  },
  {
    immediate: true,
  },
)

watch(
  () => props.hideOnScroll,
  () => {
    isActive.value = getIsActive()
  },
)

watch(
  toolbarHeight,
  (value) => {
    app.value.bar = value
  },
  {
    immediate: true,
  },
)

onBeforeMount(() => {
  app.value.top = 0
})
</script>
<style lang="scss">
@import '@sui/app/styles/components/appBar';
@import '@sui/app/styles/components/layout';

.s_appBar {
  @include s_borderRadius($s_appBar__borderRadius);
  @include s_layoutTransition();
  position: relative;
  justify-content: center;
  min-height: $s_appBar__minHeight;
  background-color: s_getAppColor('card');
  box-shadow:
    0 0.5rem 1rem rgb(0 0 0 / 5%),
    inset 0 -1px 0 rgb(0 0 0 / 10%);

  &--elevateOnScroll {
    @include s_elevation(3);
  }

  &--hideShadow {
    @include s_elevation(0, true);
  }

  &--fixed {
    position: fixed;
    top: 0;
    z-index: 5;
  }

  &--bottom {
    top: unset;
    bottom: 0;
  }

  &--shrinkOnScroll {
    .s_appBar__title {
      font-size: inherit;
    }
  }

  &--isScrolled {
    .s_appBar__title {
      padding-top: $s_appBar__scrolledTitlePaddingBottom;
    }

    &:not(.s_appBar--bottom) {
      .s_appBar__title {
        padding-bottom: $s_appBar__scrolledTitlePaddingBottom;
      }
    }
  }
}
</style>
