<template>
  <div class="s_toggleButton" :class="classes">
    <SButton
      class="s_toggleButton__button"
      :block="!groupProps.shrink"
      :color="isSelected ? groupProps.selectedColor || null : null"
      :underlined="groupProps.variant === 'underlined' && isSelected"
      tile
      :disabled="disabled"
      @click="toggleGroupItem()"
    >
      <slot></slot>
    </SButton>
  </div>
</template>
<script setup lang="ts">
import SButton from '@sui/app/components/sButton.vue'
import { ProviderPropsName } from '@sui/app/constants'
import { propsColumn, propsGroupItem } from '@sui/app/props'
import { useColumnService, useGroupItemService, useProviderService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps({
  ...propsGroupItem(),
  ...propsColumn(),
})

const { classListColumn } = useColumnService(props, { classPrefix: 'toggleButton' })
const { injectParentProps } = useProviderService()
const { toggleGroupItem, isSelected } = useGroupItemService(props)
const groupProps = injectParentProps(ProviderPropsName.toggleButtonGroupProps)

const classes = computed(() => {
  return {
    ...classListColumn.value,
    's_toggleButton--bordered': groupProps.value.bordered === true && groupProps.value.variant !== 'inset',
    's_toggleButton--shrink': groupProps.value.shrink === true,
    's_toggleButton--inset': groupProps.value.variant === 'inset',
    's_toggleButton--selected': isSelected.value,
    's_toggleButton--dense': groupProps.value.dense,
  }
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/button';
@import './variables';

.s_toggleButton {
  display: flex;
  flex: 1;
  align-items: stretch;

  @include s_makeColumn($s_gridColumns, 0, $s_gridBreakpoints);

  &--shrink {
    flex: 0;
  }

  &__button {
    max-height: 100%;
    padding: 0 calc($s_spacer * 2);
    background-color: s_getAppColor('card');

    &:focus::before {
      opacity: 0;
    }
  }

  &--bordered {
    border-top: 1px solid s_getAppColor('border');
    border-left: 1px solid s_getAppColor('border');
  }

  &--dense {
    $size: map.get($s_button--sizes, 'small');
    $fontSize: map.get($s_button--fontSizes, 'small');

    .s_toggleButton__button {
      min-width: #{$size}px;
      height: 100%;
      min-height: #{$size}px;
      padding: 0 $s_spacer;
      font-size: $fontSize;
    }
  }

  &--inset {
    .s_toggleButton__button {
      background-color: $s_toggleButton--insetBackgroundColor;

      &::before {
        border-radius: $s_toggleButton--insetBorderRadius;
      }
    }

    &.s_toggleButton--selected:not(.s_disabled) {
      .s_toggleButton__button {
        z-index: 10;
        border-radius: $s_toggleButton--insetBorderRadius;
        box-shadow: 0 3px 8px 2px #0000001f;
      }
    }
  }
}
</style>
