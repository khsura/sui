<template>
  <div
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="60"
    :class="classList"
    :style="styleList"
  >
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" :style="svgStyles">
      <circle
        fill="transparent"
        :cx="2 * viewBoxSize"
        :cy="2 * viewBoxSize"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArray"
        :stroke-dashoffset="0"
        class="s_progressCircular__underlay"
      ></circle>
      <circle
        fill="transparent"
        :cx="2 * viewBoxSize"
        :cy="2 * viewBoxSize"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDashArray"
        :stroke-dashoffset="strokeDashOffset"
        class="s_progressCircular__overlay"
      ></circle>
    </svg>
    <div class="s_progressCircular__info">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { propsTextColor, propsComponentTheme } from '@khsura/sui/props'
import { useTextColorService, useComponentThemeService } from '@khsura/sui/services'

const props = defineProps({
  ...propsTextColor(),
  size: {
    type: [Number, String],
    default: 32,
  },
  ...propsComponentTheme(),
  indeterminate: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Number,
    default: 0,
  },
  rotate: {
    type: [Number, String],
    default: null,
  },
  width: {
    type: Number,
    default: 4,
  },
})

const { classListTextColor, styleListTextColor } = useTextColorService(props)
const { themeClasses } = useComponentThemeService(props)
const radius = ref(20)

const calculatedSize = computed(() => {
  return Number(props.size)
})

const circumference = computed(() => {
  return 2 * Math.PI * radius.value
})

const classList = computed(() => {
  return {
    s_progressCircular: true,
    's_progressCircular--indeterminate': props.indeterminate,
    ...classListTextColor.value,
    ...themeClasses.value,
  }
})

const normalizedValue = computed(() => {
  if (props.value < 0) {
    return 0
  }

  if (props.value > 100) {
    return 100
  }

  return parseFloat(props.value.toString())
})

const strokeDashArray = computed(() => {
  return Math.round(circumference.value * 1000) / 1000
})

const strokeDashOffset = computed(() => {
  return ((100 - normalizedValue.value) / 100) * circumference.value + 'px'
})

const strokeWidth = computed(() => {
  return (Number(props.width) / +props.size) * viewBoxSize.value * 2
})

const styleList = computed(() => {
  return {
    height: `${calculatedSize.value}px`,
    width: `${calculatedSize.value}px`,
    ...styleListTextColor.value,
  }
})

const svgStyles = computed(() => {
  return {
    transform: `rotate(${Number(props.rotate)}deg)`,
  }
})

const viewBoxSize = computed(() => {
  return radius.value / (1 - Number(props.width) / +props.size)
})

const viewBox = computed(() => {
  return `${viewBoxSize.value} ${viewBoxSize.value} ${2 * viewBoxSize.value} ${2 * viewBoxSize.value}`
})
</script>
<style lang="scss">
@keyframes progress-circular-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes progress-circular-rotate {
  100% {
    transform: rotate(360deg);
  }
}

.s_progressCircular {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  > svg {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    margin: auto;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__underlay {
    z-index: 1;
    stroke: rgb(s_getAppColor('card') 0.2);
  }

  &__overlay {
    z-index: 2;
    stroke: currentcolor;
    transition: all 0.6s ease-in-out;
  }

  &--indeterminate {
    > svg {
      transform-origin: center center;
      transition: all 0.2s ease-in-out;
      animation: progress-circular-rotate 1.4s linear infinite;
    }

    .s_progressCircular__overlay {
      stroke-linecap: round;
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: progress-circular-dash 1.4s ease-in-out infinite;
    }
  }
}
</style>
