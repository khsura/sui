<template>
  <component :is="tagName" ref="footerElement" class="s_footer" :style="styles" :class="classes">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { getCleanSetObject, getNumericCssAttribute, getNumericValue, getWindow } from '@sui/app/lib'
import { propsColor, propsLayout, propsMeasurableStyles, propsPosition, propsElevation, propsTag } from '@sui/app/props'
import {
  useColorService,
  useElevationService,
  useLayoutService,
  useMeasurableStylesService,
  usePositionService,
  useTagService,
} from '@sui/app/services'
import { computed, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'

const props = defineProps({
  ...propsLayout({ app: false }),
  ...propsTag<'div' | 'footer'>({ tag: 'footer' }),
  ...propsColor(),
  ...propsMeasurableStyles(),
  ...propsElevation(),
  ...propsPosition(),
  inset: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  padless: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const { tagName } = useTagService(props)
const { left, right, width, app, isApp } = useLayoutService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListColor, styleListColor } = useColorService(props)
const { classListElevation } = useElevationService(props)

const { isAbsolutePosition, isFixedPosition, isFixedOrAbsolutePosition } = usePositionService(props, {
  ignoreApp: true,
})

const footerElement = ref<HTMLElement | null>(null)

const updateFooterHeight = (height?: number | undefined | null | string) => {
  const shouldUseElementHeight = height === undefined || height === null

  const footerHeight = shouldUseElementHeight
    ? footerElement.value?.offsetHeight ?? 0
    : getNumericValue(height, { defaultValue: 0, isPositive: true }) + app.value.bottomNavigationHeight

  if (footerHeight !== app.value.footerHeight) {
    app.value.footerHeight = footerHeight
  }
}

const getPaddingBottom = () => {
  if (isApp.value && app.value.bottomNavigationHeight) {
    return getNumericCssAttribute(app.value.bottomNavigationHeight + (props.padless ? 0 : 16))
  }

  return undefined
}

const classes = computed(() => {
  return {
    ...classListColor.value,
    ...classListElevation.value,
    's_footer--absolute': isApp.value && isAbsolutePosition.value,
    's_footer--fixed': isApp.value && isFixedPosition.value,
    's_footer--inset': props.inset,
    's_footer--padless': props.padless,
  }
})

const styles = computed(() => {
  return getCleanSetObject({
    ...styleListColor.value,
    ...measurableStyles.value,
    left: left.value,
    right: right.value,
    bottom: isFixedOrAbsolutePosition ? '0px' : undefined,
    width: width.value,
    paddingBottom: getPaddingBottom(),
  })
})

watch(() => props.height, updateFooterHeight)
let timeout: number | undefined

onMounted(() => {
  updateFooterHeight(props.height)
  timeout = getWindow()?.setTimeout(() => {
    updateFooterHeight(props.height)
  }, 1000)
})

onBeforeUnmount(() => {
  updateFooterHeight(0)
  getWindow()?.clearTimeout(timeout)
})
</script>
<style lang="scss">
@import '@sui/app/styles/components/layout';

$s_footerBorderRadius: 0 !default;
$s_footerPadding: 6px 16px 16px !default;
$s_footerPadlessPadding: 0 !default;
$s_footerShapedBorderRadius: map-get($s_rounded, 'xl') $s_footerBorderRadius !default;

.s_footer {
  position: relative;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  align-items: center;
  padding: $s_footerPadding;
  color: s_getAppColor('text');
  background-color: s_getAppColor('appBar');
  border-radius: $s_footerBorderRadius;

  @include s_layoutTransition();

  &--shaped {
    border-radius: $s_footerShapedBorderRadius;
  }

  &--absolute,
  &--fixed {
    z-index: 3;
  }

  &--absolute {
    position: absolute;

    &:not(.s_footer--inset) {
      width: 100%;
    }
  }

  &--fixed {
    position: fixed;
  }

  &--padless {
    padding: $s_footerPadlessPadding;
  }
}
</style>
