<template>
  <div :class="classList" :style="styleListBorder">
    <button :class="classListButton" @click="updateValue" :type="getButtonType(type)">
      <input
        :id="computedId"
        type="radio"
        :name="groupProps?.name ?? name ?? undefined"
        :value="value"
        :checked="isSelected"
        :class="classListInput"
        :disabled="groupProps?.disabled || !!disabled"
      />
      <slot name="label" :attrs="{ class: classListLabel }">
        <label v-if="label" :for="id" :class="classListLabel">{{ label }}</label>
      </slot>
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, nextTick, useId } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { useBorderService, useDisabledService, useSingleGroupItemService } from '@/app/services'
import type { PropsBorder, PropsDisabled, PropsSingleGroupItem } from '@/app/definitions'
import type { ButtonType } from '@/app/constants'
import { getButtonType } from '@/app/lib/button'

const props = defineProps<
  {
    id?: string
    name?: string | null
    label?: string | null
    type?: ButtonType
  } & PropsDisabled &
    PropsSingleGroupItem &
    PropsBorder
>()

const emit = defineEmits<(event: 'update:checked', value: boolean) => void>()
const groupProps = inject(ProviderPropsName.radioGroupProps)
const { toggleGroupItem, isSelected } = useSingleGroupItemService(props)
const generatedId = useId()
const computedId = computed(() => props.id ?? generatedId)

const { classListDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: props.disabled ?? groupProps?.disabled,
      readonly: props.readonly ?? groupProps?.readonly,
    }
  }),
)

const { classListBorder, styleListBorder } = useBorderService(groupProps)

const { classListDisabled: classListRadioGroupDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: groupProps?.disabled,
      readonly: groupProps?.readonly,
    }
  }),
)

const classList = computed(() => {
  return {
    s_radio: true,
    's_radio--column': groupProps?.column,
    's_radio--grow': groupProps?.grow,
  }
})

const classListButton = computed(() => {
  return {
    s_radio__button: true,
    's_radio__button--notSet': groupProps?.modelValue === null || groupProps?.modelValue === undefined,
    [`s_radio__button--color__${groupProps?.color}`]: !!groupProps?.color,
    ...classListBorder.value,
    's_radio__button--grow': groupProps?.grow,
    // TODO (Sura) classListBorder.value['s_outlined'] is not good. because it's hard to refer. improve in the future
    s_outlined: !!props.outlined || classListBorder.value.s_outlined,
    s_disabled: classListDisabled.value.s_disabled || classListRadioGroupDisabled.value.s_disabled,
  }
})

const classListInput = computed(() => {
  return {
    s_radio__input: true,
  }
})

const classListLabel = computed(() => {
  return {
    s_radio__label: true,
    's_radio__label--checked': isSelected.value,
  }
})

const updateValue = async () => {
  toggleGroupItem()
  await nextTick()
  emit('update:checked', isSelected.value)
}
</script>

<style lang="scss">
.s_radio {
  &--column {
    display: flex;
    flex: 0 0 100%;
  }

  &--grow {
    display: flex;
    flex: 1;
  }

  &__button {
    @include s_button();

    @each $colorName in $s_presetColorNames {
      &--color__#{$colorName} {
        .s_radio__label {
          /* stylelint-disable-next-line max-nesting-depth */
          &::before {
            border: 2px solid s_getPresetColor($colorName);
          }
          /* stylelint-disable-next-line max-nesting-depth */
          &--checked::after {
            background-color: s_getPresetColor($colorName);
          }
        }
      }
    }

    &--notSet {
      background-color: s_getAppColor('inputPlaceholderShown');
    }

    &--grow {
      flex: 1;
      justify-content: start;
    }
  }

  &__input {
    display: none;
  }

  &__label {
    position: relative;
    padding-left: 32px;
    color: s_getAppColor('secondaryText');
    pointer-events: none;
    cursor: inherit;

    &::before {
      position: absolute;
      top: calc(50% - 12px);
      left: 0;
      width: 24px;
      height: 24px;
      cursor: pointer;
      content: '';
      background-color: s_getAppColor('card');
      border: 2px solid s_getAppColor('secondaryText');
      border-radius: 50%;
    }

    &--checked {
      color: s_getAppColor('textColor');

      &::before {
        border: 2px solid s_getPresetColor('info');
      }

      &::after {
        position: absolute;
        top: calc(50% - 6px);
        left: 6px;
        z-index: 2;
        width: 12px;
        height: 12px;
        content: '';
        background-color: s_getPresetColor('info');
        border-radius: 50%;
      }
    }
  }
}
</style>
