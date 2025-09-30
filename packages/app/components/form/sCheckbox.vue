<template>
  <div class="s_checkbox" :class="checkboxClasses">
    <div class="s_checkbox__container">
      <input
        :id="id ?? innerId"
        :value="model"
        ref="checkboxElement"
        @input="toggleModel($event)"
        class="s_checkbox__input"
        type="checkbox"
        :readonly="readonly ?? false"
        :disabled="disabled ?? false"
      />
      <label :for="id ?? innerId" class="s_checkbox__label">
        <span v-if="label" class="s_checkbox__labelText">{{ label }}</span>
      </label>
    </div>
    <FormInputError v-if="!hideDetails" :errors="errors"></FormInputError>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import FormInputError from '@khsura/sui/components/form/common/sFormInputError.vue'
import { type PropsCheckbox } from '@khsura/sui/definitions'
import { useColorRepository } from '@khsura/sui/repositories'
import { useFormInputService } from '@khsura/sui/services'

const props = defineProps<PropsCheckbox>()
const checkboxElement = ref<HTMLInputElement | null>(null)
const innerId = useId()

const emit = defineEmits<{
  (event: 'change', value: boolean): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
}>()

// TODO: Sura - make able to use all preset colors
const model = defineModel<boolean>()
const { getIsPredefinedPresetColor } = useColorRepository()
const { updateFormInput, errors } = useFormInputService<boolean>(props, emit, model)

const toggleModel = async (event: Event) => {
  event.preventDefault()
  const value = (event.target as HTMLInputElement).checked

  if (props.disabled || props.readonly) {
    ;(event.target as HTMLInputElement).checked = model.value ?? false
    await nextTick()

    return
  }

  model.value = value
}

const initCheckbox = (initialValue: boolean | undefined) => {
  if (checkboxElement.value && checkboxElement.value.checked !== initialValue) {
    checkboxElement.value.checked = initialValue ?? false
  }
}

watch(model, (v) => {
  initCheckbox(v)
  void updateFormInput(v)
})

onMounted(() => {
  initCheckbox(model.value)
})

const checkboxClasses = computed(() => {
  return {
    's_checkbox--bordered': props.bordered,
    's_checkbox--block': props.block,
    's_checkbox--disabled': props.disabled,
    's_checkbox--readonly': props.readonly,
    's_checkbox--size__large': props.size === 'large',
    [`s_checkbox--color__${props.color}`]: getIsPredefinedPresetColor(props.color),
  }
})
</script>
<style lang="scss">
$s_checkbox--size__large: 32px;
$s_checkbox--size: 24px;

.s_checkbox {
  display: flex;
  align-items: center;

  &__container {
    position: relative;
    display: inline-flex;
  }

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

  &:not(&--disabled, &--readonly):hover &__label::before {
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
    transform: rotate(-45deg) scale(0);
    transition: transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
  }

  :checked + &__label::after {
    transform: rotate(-45deg) scale(1);
  }

  @each $colorName in $s_presetColorNames {
    &--color__#{$colorName} {
      &:not(.s_checkbox--disabled) {
        :checked + .s_checkbox__label::before {
          background-color: s_getPresetColor($colorName);
          border: 2px solid s_getPresetColor($colorName);
        }

        :checked + .s_checkbox__label::after {
          border-color: s_getPresetColor($colorName, true);
        }
      }

      &:not(.s_checkbox--disabled, .s_checkbox--readonly):hover .s_checkbox__label::before {
        border: 2px solid s_getPresetColor($colorName);
      }
    }
  }

  &--disabled {
    .s_checkbox__label::before {
      cursor: default;
      background-color: s_getAppColor('disabled');
      border: 1px solid s_getAppColor('disabled');
    }

    .s_checkbox__label::after {
      cursor: default;
      border-color: s_getAppColor('card');
    }

    .s_checkbox__label {
      cursor: default;
    }
  }

  &--readonly {
    .s_checkbox__label::before {
      cursor: default;
    }

    .s_checkbox__label::after {
      cursor: default;
    }

    .s_checkbox__label {
      cursor: default;
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
