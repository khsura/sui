<template>
  <div class="s_checkbox" :class="checkboxClasses">
    <input :id="id" v-model="model" class="s_checkbox__input" type="checkbox" />
    <label :for="id" class="s_checkbox__label">
      <span v-if="label" class="s_checkbox__labelText">{{ label }}</span>
    </label>
    <FormInputError v-if="!hideDetails" :errors="errors"></FormInputError>
  </div>
</template>
<script setup lang="ts">
import FormInputError from '@sui/app/components/form/common/sFormInputError.vue'
import { propsCheckbox } from '@sui/app/props'
import { getIsPresetColor } from '@sui/app/repositories/colorRepository'
import { useFormInputService, useModelService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps(propsCheckbox())

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
}>()

const { updateFormInput, errors } = useFormInputService<boolean>(props, emit)

const model = useModelService<boolean, 'modelValue', typeof props, typeof emit>(props, emit, 'modelValue', {
  formatter: (v) => {
    return v ?? false
  },
  onChange: async (value) => {
    await updateFormInput(value ?? false, true)
  },
})

const checkboxClasses = computed(() => {
  return {
    's_checkbox--bordered': props.bordered,
    's_checkbox--block': props.block,
    's_checkbox--size__large': props.size === 'large',
    [`s_checkbox--color__${props.color}`]: getIsPresetColor(props.color),
  }
})
</script>
<style lang="scss">
$s_checkbox--size__large: 32px;
$s_checkbox--size: 24px;

.s_checkbox {
  position: relative;
  display: inline-flex;

  &--bordered {
    border: 1px solid s_getAppColor('border');
  }

  &--block {
    display: block;
  }

  &__input {
    display: none;
  }

  &__label {
    position: relative;
    top: 0;
    left: 0;
    display: inline-flex;
    align-items: center;
    min-height: $s_checkbox--size;
    padding-left: $s_checkbox--size;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;

    &Text {
      padding-left: 8px;
    }
  }

  &__label::before {
    position: absolute;
    left: 0;
    display: block;
    width: $s_checkbox--size;
    height: $s_checkbox--size;
    cursor: pointer;
    content: '';
    background-color: s_getAppColor('card');
    border: 2px solid s_getAppColor('text');
    border-radius: 4px;
  }

  :checked + &__label::before {
    background-color: s_getPresetColor('info');
    border: 2px solid s_getPresetColor('info');
  }

  &:hover &__label::before {
    border: 2px solid s_getPresetColor('info');
  }

  &__label::after {
    position: absolute;
    top: 7px;
    left: 6px;
    z-index: 2;
    width: 13px;
    height: 7px;
    content: '';
    border-color: s_getAppColor('card');
    border-style: none none solid solid;
    border-width: 2px;
    transition: transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
    transform: rotate(-45deg) scale(0);
  }

  :checked + &__label::after {
    transform: rotate(-45deg) scale(1);
  }

  @each $colorName in $s_presetColorNames {
    &--color__#{$colorName} {
      :checked + .s_checkbox__label::before {
        background-color: s_getPresetColor($colorName);
        border: 2px solid s_getPresetColor($colorName);
      }

      &:hover .s_checkbox__label::before {
        border: 2px solid s_getPresetColor($colorName);
      }
    }
  }
}

.s_checkbox--size__large {
  .s_checkbox {
    &__label {
      min-height: $s_checkbox--size__large;
      padding-left: $s_checkbox--size__large;
      font-size: 20px;

      &Text {
        padding-left: 10px;
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    &__label::before {
      width: $s_checkbox--size__large;
      height: $s_checkbox--size__large;
    }

    &__label::after {
      width: 20px;
      height: 12px;
      border-width: 3px;
    }
  }
}
</style>
