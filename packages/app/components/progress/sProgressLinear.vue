<template>
  <div
    :class="progressClasses"
    :style="progressStyles"
    role="progressbar"
    :[`aria-valuemin`]="0"
    :[`aria-valuemax`]="100"
    :[`aria-valuenow`]="value"
  >
    <div :class="backgroundClasses" :style="backgroundStyles"></div>
    <div :class="barClasses" :style="barStyles"></div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useColorRepository } from '@sui/app/repositories'
import { computed } from 'vue'
import { type PropType } from 'vue'
import { getNumericCssAttribute } from '@sui/app/lib'

const props = defineProps({
  fixed: {
    type: Boolean,
    default: true,
  },
  absolute: {
    type: Boolean,
    default: true,
  },
  backgroundColor: {
    type: String as PropType<string | null>,
    default: null,
  },
  backgroundOpacity: {
    type: [Number, String] as PropType<string | number | null>,
    default: null,
  },
  color: {
    type: String,
    default: 'info',
  },
  size: {
    type: [Number, String] as PropType<string | number | null>,
    default: null,
  },
  indeterminate: { type: Boolean, default: false },
  value: {
    type: [Number, String],
    default: 0,
  },
})

const { getBackgroundColorAttributes } = useColorRepository()

const backgroundColorAttrs = computed(() => {
  return getBackgroundColorAttributes(props.backgroundColor ?? props.color)
})

const barColorAttrs = computed(() => {
  return getBackgroundColorAttributes(props.color)
})

const progressClasses = computed(() => {
  return {
    s_progressLinear: true,
    's_progressLinear--absolute': props.absolute,
    's_progressLinear--fixed': props.fixed,
    's_progressLinear--indeterminate': props.indeterminate,
  }
})

const progressStyles = computed(() => {
  const height = getNumericCssAttribute(props.size)

  return height !== undefined
    ? {
        height,
      }
    : {}
})

const backgroundClasses = computed(() => {
  return {
    s_progressLinear__background: true,
    ...backgroundColorAttrs.value.class,
  }
})

const backgroundStyles = computed(() => {
  return {
    ...(props.backgroundOpacity ? { opacity: props.backgroundOpacity } : {}),
    ...backgroundColorAttrs.value.style,
  }
})

const barClasses = computed(() => {
  return {
    s_progressLinear__bar: true,
    ...barColorAttrs.value.class,
  }
})

const barStyles = computed(() => {
  return {
    ...(props.indeterminate ? {} : { width: `${props.value}%` }),
    ...barColorAttrs.value.style,
  }
})
</script>
<style lang="scss">
.s_progressLinear {
  $base: &;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc($s_spacer / 2);

  &--absolute {
    position: absolute;
  }

  &--fixed {
    position: fixed;
  }

  &__background,
  &__bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: s_getAppColor('text');
  }

  &__background {
    width: 100%;
    opacity: 0.3;
  }

  &--indeterminate {
    #{$base}__bar {
      width: 100%;
      height: 100%;
      transform-origin: 0% 50%;
      animation: s-indeterminate-animation 1.5s infinite linear;
    }
  }
}
</style>
