<template>
  <section class="s_toggleButtonGroup" :class="classes">
    <div class="s_toggleButtonGroup__content" :class="contentClasses">
      <slot></slot>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants'
import { propsToggleButtonGroup } from '@sui/app/props'
import { useBorderService, useGroupService, useProviderService } from '@sui/app/services'
import { type GroupItemValue } from '@sui/app/types'
import { computed } from 'vue'

const props = defineProps(propsToggleButtonGroup())

const emit = defineEmits<(event: 'update:modelValue', value: GroupItemValue[] | null) => void>()

const { classListBorder } = useBorderService(props)
const { provideProps } = useProviderService()

provideProps(ProviderPropsName.toggleButtonGroupProps, props)
useGroupService(props, emit)

const classes = computed(() => {
  return {
    ...classListBorder.value,
    's_toggleButtonGroup--dense': props.dense,
    's_toggleButtonGroup--bordered': props.bordered && props.variant !== 'inset',
    's_toggleButtonGroup--shrink': props.shrink,
    's_toggleButtonGroup--inset': props.variant === 'inset',
  }
})

const contentClasses = computed(() => {
  return {
    's_toggleButtonGroup__content--nowrap': props.nowrap,
  }
})
</script>

<style lang="scss">
@import './variables';

.s_toggleButtonGroup {
  @include s_borderRadius();
  position: relative;
  overflow: hidden;

  &--shrink {
    display: inline-block;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;

    &--nowrap {
      flex-wrap: nowrap;
    }
  }

  &--bordered {
    border: 1px s_getAppColor('border') solid;

    .s_toggleButtonGroup__content {
      margin-top: -1px;
      margin-left: -1px;
    }
  }

  &--inset {
    padding: 2px;
    background-color: $s_toggleButton--insetBackgroundColor;
    border-radius: $s_toggleButton--insetBorderRadius;
  }
}
</style>
