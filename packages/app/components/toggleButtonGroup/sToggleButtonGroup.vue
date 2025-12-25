<template>
  <section :class="classList" :style="styleListBorder">
    <div class="s_toggleButtonGroup__content">
      <slot></slot>
    </div>
  </section>
</template>
<script setup lang="ts" generic="T extends GroupItemValue = GroupItemValue">
import { computed } from 'vue'
import { ProviderPropsName } from '@/app/constants'
import type { PropsToggleButtonGroup } from '@/app/definitions'
import { useBorderService, useGroupService, useProviderService } from '@/app/services'
import { type GroupItemValue } from '@/app/types'

const props = withDefaults(defineProps<PropsToggleButtonGroup>(), {
  selectedColor: 'primary',
})

const model = defineModel<T[] | null>({ default: [], required: false })

useGroupService<T>(props, model)

const { classListBorder, styleListBorder } = useBorderService(props)
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
.s_toggleButtonGroup {
  @include s_borderRadius();
  position: relative;
  overflow: hidden;

  &--inset {
    padding: 2px;
    background-color: $s_toggleButton--insetBackgroundColor;
    border-radius: $s_toggleButton--insetBorderRadius;
  }

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
