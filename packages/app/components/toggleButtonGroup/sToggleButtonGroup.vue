<template>
  <section :class="classList">
    <div class="s_toggleButtonGroup__content">
      <slot></slot>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants'
import { type GroupItemValue } from '@sui/app/types'
import { propsToggleButtonGroup } from '@sui/app/props'
import { useBorderService, useGroupService, useProviderService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps(propsToggleButtonGroup())
const model = defineModel<GroupItemValue[]>({ default: [], required: false })

useGroupService(props, model)
const { classListBorder } = useBorderService(props)
const { provideProps } = useProviderService()

const isInset = computed(() => {
  return props.variant === 'inset'
})

const isBordered = computed(() => {
  return !isInset.value && props.bordered
})

const classList = computed(() => {
  return {
    ...classListBorder.value,
    s_toggleButtonGroup: true,
    's_toggleButtonGroup--inset': isInset.value,
    's_toggleButtonGroup--dense': props.dense,
    's_toggleButtonGroup--bordered': isBordered.value,
    's_toggleButtonGroup--shrink': props.shrink,
  }
})

provideProps(ProviderPropsName.toggleButtonGroupProps, props)
</script>

<style lang="scss">
@import './variables';

.s_toggleButtonGroup {
  @include s_borderRadius();

  &--inset {
    padding: 2px;
    background-color: $s_toggleButton--insetBackgroundColor;
    border-radius: $s_toggleButton--insetBorderRadius;
  }
  position: relative;
  overflow: hidden;

  &--shrink {
    display: inline-block;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
  }

  &--bordered {
    border: thin s_getAppColor('border') solid;

    .s_toggleButtonGroup__content {
      margin-top: -1px;
      margin-left: -1px;
    }
  }
}
</style>
