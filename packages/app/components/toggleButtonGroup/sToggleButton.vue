<template>
  <div class="s_toggleButton" :class="classes">
    <SButton
      class="s_toggleButton__button"
      :block="!groupProps.shrink"
      :color="isSelected ? groupProps.selectedColor || undefined : undefined"
      :underlined="groupProps.variant === 'underlined' && isSelected"
      tile
      :disabled="disabled"
      v-bind="ariaAttributes"
      @click="toggleGroupItem()"
    >
      <slot></slot>
    </SButton>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import SButton from '@/app/components/sButton.vue'
import { ProviderPropsName } from '@/app/configs'
import type { PropsToggleButton } from '@/app/definitions'
import { useColumnService, useGroupItemService } from '@/app/services'

const props = defineProps<PropsToggleButton>()
const { classListColumn } = useColumnService(props, { classPrefix: 'toggleButton' })
const { toggleGroupItem, isSelected } = useGroupItemService(props)
const groupProps = inject(ProviderPropsName.toggleButtonGroupProps)
// Set when the group is an STabs: the button is then a tab, otherwise a toggle (pressed) button
const tabsProps = inject(ProviderPropsName.tabsProps, null)

if (!groupProps) {
  throw new Error('ToggleButtonGroup props not found')
}

const ariaAttributes = computed(() => {
  if (tabsProps) {
    return {
      role: 'tab',
      'aria-selected': isSelected.value,
      // roving tabindex: only the selected tab is a Tab stop, the arrow keys reach the others
      tabindex: isSelected.value ? 0 : -1,
    }
  }

  return { 'aria-pressed': isSelected.value }
})

const classes = computed(() => {
  return {
    ...classListColumn.value,
    's_toggleButton--bordered': groupProps.bordered === true && groupProps?.variant !== 'inset',
    's_toggleButton--shrink': groupProps.shrink === true,
    's_toggleButton--inset': groupProps.variant === 'inset',
    's_toggleButton--selected': isSelected.value,
    's_toggleButton--dense': groupProps.dense,
  }
})
</script>

<style lang="scss">
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
    border-radius: unset;

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
        border-radius: $s_toggleButton--insetBorderRadius;
        box-shadow: 0 3px 8px 2px #0000001f;
      }
    }
  }
}
</style>
