<template>
  <div v-if="shouldRender" :class="classList" :style="styleList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { PropsAlert } from '@/app/definitions'
import { alertDefaultSize, alertPaddingsMap, alertDensePaddingsMap, alertFontSizeMap } from '@/app/constants'
import { useColorService } from '@/app/services'

const props = defineProps<PropsAlert>()
const slots = useSlots()
const hasContent = computed(() => !!slots.default?.().length)
const shouldRender = computed(() => props.fixedHeight || hasContent.value)
const { classListColor, styleListColor } = useColorService(props)

const resolvedSize = computed(() => {
  return props.size ?? alertDefaultSize
})

const classList = computed(() => {
  return {
    s_alert: true,
    [`s_alert--size__${resolvedSize.value}`]: true,
    's_alert--dense': props.dense,
    's_alert--fixedHeight': props.fixedHeight,
    ...classListColor.value,
  }
})

const styleList = computed(() => {
  const minHeight =
    props.minHeight ?? 2 * alertPaddingsMap[resolvedSize.value].vertical + alertFontSizeMap[resolvedSize.value] + 16

  const denseMinHeight =
    props.minHeight ??
    2 * alertDensePaddingsMap[resolvedSize.value].vertical + alertFontSizeMap[resolvedSize.value] + 16

  return {
    ...styleListColor.value,
    '--s-alert-padding-horizontal': `${alertPaddingsMap[resolvedSize.value].horizontal}px`,
    '--s-alert-padding-vertical': `${alertPaddingsMap[resolvedSize.value].vertical}px`,
    '--s-alert-dense-padding-horizontal': `${alertDensePaddingsMap[resolvedSize.value].horizontal}px`,
    '--s-alert-dense-padding-vertical': `${alertDensePaddingsMap[resolvedSize.value].vertical}px`,
    '--s-alert-font-size': `${alertFontSizeMap[resolvedSize.value]}px`,
    '--s-alert-min-height': `${minHeight}px`,
    '--s-alert-dense-min-height': `${denseMinHeight}px`,
  }
})
</script>
<style lang="scss">
/* stylelint-disable value-keyword-case */
/* stylelint-disable custom-property-pattern */

.s_alert {
  @include s_dark();
  position: relative;
  display: flex;
  align-items: center;
  min-height: var(--s-alert-min-height);
  padding: var(--s-alert-padding-vertical) var(--s-alert-padding-horizontal);
  font-size: var(--s-alert-font-size);
  background-color: s_getAppColor('card');
  border-radius: $s_borderRadius;

  &--dense {
    min-height: var(--s-alert-dense-min-height);
    padding: var(--s-alert-dense-padding-vertical) var(--s-alert-dense-padding-horizontal);
  }

  &--fixedHeight {
    height: 100%;
    overflow: hidden;
  }
}
</style>
