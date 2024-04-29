<template>
  <main class="s_footer" :style="styles" :class="classes">
    <slot></slot>
  </main>
</template>
<script setup lang="ts">
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsColor, propsLayout, propsMeasurableStyles, propsPosition, propsElevation } from '@sui/app/props'
import {
  useColorService,
  useElevationService,
  useLayoutService,
  useMeasurableStylesService,
  usePositionService,
} from '@sui/app/services'
import { computed, watch } from 'vue'

const props = defineProps({
  ...propsLayout({ app: false }),
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

const { left, right, width, app } = useLayoutService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListColor, styleListColor } = useColorService(props)
const { classListElevation } = useElevationService(props)
const { classListPosition, isAbsolutePosition, isFixedPosition } = usePositionService(props, { ignoreApp: true })

watch(
  () => props.height,
  (value) => {
    const footerHeight = Number(value)

    app.value.footer = Number.isNaN(footerHeight) ? 0 : footerHeight
  },
  {
    immediate: true,
  },
)

const classes = computed(() => {
  return {
    ...classListPosition.value,
    ...classListColor.value,
    ...classListElevation.value,
    's_footer--absolute': isAbsolutePosition.value,
    's_footer--fixed': isFixedPosition.value,
    's_footer--inset': props.inset,
    's_footer--padless': props.padless,
  }
})

const styles = computed(() => {
  return {
    ...styleListColor.value,
    ...measurableStyles.value,
    left: left.value,
    right: right.value,
    width: width.value,
    paddingBottom: getNumericCssAttribute(app.value.bottom + 16),
  }
})
</script>
<style lang="scss">
@import '@sui/app/styles/components/layout';

$s_footerBorderRadius: 0 !default;
$s_footerPadding: 6px 16px !default;
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
    &:not(.s_footer--inset) {
      width: 100%;
    }
  }

  &--padless {
    padding: $s_footerPadlessPadding;
  }
}
</style>
