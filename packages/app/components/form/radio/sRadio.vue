<template>
  <div :class="classList">
    <button :class="classListButton" @click="updateValue">
      <input
        :id="id"
        type="radio"
        :name="groupProps.name || name"
        :value="value"
        :checked="isSelected"
        :class="classListInput"
        :disabled="groupProps.disabled || !!disabled"
      />
      <slot name="label" :attrs="{ class: classListLabel }">
        <label v-if="label" :for="id" :class="classListLabel">{{ label }}</label>
      </slot>
    </button>
  </div>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants/provider'
import { propsDisabled, propsSingleGroupItem } from '@sui/app/props'
import { useBorderService, useDisabledService, useProviderService, useSingleGroupItemService } from '@sui/app/services'
import { computed, nextTick } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  outlined: {
    type: Boolean,
    default: null,
  },
  ...propsDisabled(),
  ...propsSingleGroupItem(),
})

const emit = defineEmits<(event: 'update:checked', value: boolean) => void>()
const { injectParentProps } = useProviderService()
const groupProps = injectParentProps(ProviderPropsName.radioGroupProps)
const { toggleGroupItem, isSelected } = useSingleGroupItemService(props)

const { classListDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: props.disabled ?? groupProps.value.disabled,
      readonly: props.readonly ?? groupProps.value.readonly,
    }
  }),
)

const { classListBorder } = useBorderService(groupProps)

const { classListDisabled: classListRadioGroupDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: groupProps.value.disabled,
      readonly: groupProps.value.readonly,
    }
  }),
)

const classList = computed(() => {
  return {
    s_radio: true,
    's_radio--column': groupProps.value.column,
    's_radio--grow': groupProps.value.grow,
  }
})

const classListButton = computed(() => {
  return {
    s_radio__button: true,
    's_radio__button--notSet': groupProps.value.modelValue === null || groupProps.value.modelValue === undefined,
    [`s_radio__button--color__${groupProps.value.color}`]: !!groupProps.value.color,
    ...classListBorder.value,
    's_radio__button--grow': groupProps.value.grow,
    // TODO (Sura) classListBorder.value['s_outlined'] is not good. because it's hard to refer. improve in the future
    s_outlined: props.outlined || classListBorder.value.s_outlined,
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
@import '@sui/app/styles/components/button';

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
