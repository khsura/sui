<template>
  <section class="s_textarea" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_textarea__label">{{ label }}</label>
    <textarea
      :id="inputId"
      ref="textareaElement"
      v-bind="
        getCleanSetObject({
          ...ariaAttributesFormInput,
          'aria-label': ariaLabel ?? (hideDetails ? label : undefined),
          'aria-labelledby': ariaLabelledby,
          autocapitalize,
          autocomplete,
          autofocus,
          cols,
          disabled,
          maxlength,
          minlength,
          name,
          placeholder,
          readonly,
          rows,
          spellcheck,
        })
      "
      v-model="model"
      :class="inputClassList"
      :style="inputStyleList"
      @keydown="(event) => onEvent('keydown', event)"
      @input="(event) => onEvent('input', event)"
      @blur="(event) => onEvent('blur', event)"
    />
    <div v-if="!hideDetails && (!hideError || counter)" class="s_textarea__details">
      <kFormInputError
        v-if="!hideError"
        :id="errorId"
        class="s_textarea__error"
        :errors="errors"
        :simple="simple"
      ></kFormInputError>
      <span v-if="counter" class="s_textarea__counter">{{ counterText }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import kFormInputError from './common/sFormInputError.vue'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import type { PropsTextarea } from '@/app/definitions'
import { useColorRepository } from '@/app/repositories/colorRepository'
import {
  useComponentDefaultsService,
  useDisabledService,
  useFieldLayoutService,
  useFormInputService,
} from '@/app/services'
import { type EmitFormTextInput } from '@/app/types'

const rawProps = withDefaults(defineProps<PropsTextarea<string>>(), {
  rows: 2,
  cols: 20,
})

const props = useComponentDefaultsService('STextarea', rawProps)
const emit = defineEmits<EmitFormTextInput<string>>()
const textareaElement = ref<HTMLTextAreaElement | null>(null)

const model = defineModel<string>({
  get: (v) => v ?? '',
  default: '',
})

const { updateFormInput, errors, hasError, inputId, errorId, ariaAttributesFormInput } = useFormInputService<string>(
  props,
  emit,
  model,
)

const { classListDisabled } = useDisabledService(props)
// TODO - Sura: make able to use all preset colors
const { getIsPredefinedPresetColor } = useColorRepository()
const isPresetInputBackground = computed(() => getIsPredefinedPresetColor(props.inputBackground))
const isPresetPlaceholderBackground = computed(() => getIsPredefinedPresetColor(props.placeholderBackground ?? null))
const textareaHeight = ref<string | null>(null)

const { classListField } = useFieldLayoutService(
  computed(() => ({
    hasLabel: !!props.label && !props.hideDetails,
    hasDetails: !props.hideDetails && (!props.hideError || !!props.counter),
  })),
)

const classList = computed(() => {
  return {
    ...classListField.value,
    's_textarea--disabled': props.disabled,
    's_textarea--dense': props.dense,
    's_textarea--tile': props.tile,
    's_textarea--error': hasError.value,
    [`s_textarea--size__${props.size}`]: props.size,
  }
})

const inputClassList = computed(() => {
  return {
    s_textarea__input: true,
    // On the field only, like SInput: on the root it greyed out the label and error line too.
    ...classListDisabled.value,
    [`s_textarea__input--${props.inputBackground}`]: !!isPresetInputBackground.value,
    [`s_textarea__inputPlaceholder--${props.placeholderBackground}`]: !!isPresetPlaceholderBackground.value,
    's_textarea--resize__none': !props.resize,
  }
})

const inputStyleList = computed(() => {
  return {
    ...(!isPresetInputBackground.value ? { backgroundColor: props.inputBackground } : {}),
    ...(textareaHeight.value ? { height: textareaHeight.value, overflow: 'hidden' } : {}),
  }
})

// `12 / 200` with a maxlength, otherwise just the character count.
const counterText = computed(() => {
  const length = model.value.length

  return props.maxlength ? `${length} / ${props.maxlength}` : `${length}`
})

const onEvent = async (name?: string, event?: Event | KeyboardEvent) => {
  if (textareaElement.value) {
    if (props.autogrow) {
      textareaHeight.value = 'auto'
      await nextTick()
      textareaHeight.value = getNumericCssAttribute(textareaElement.value.scrollHeight) ?? null
    }
  }

  /** wrote it like to suppress eslint */
  if (event) {
    switch (name) {
      case 'blur':
        emit(name, event as Event)
        break
      case 'input':
        emit(name, event as Event)
        emit('change', model.value ?? '')
        break
      case 'keydown':
        emit(name, event as KeyboardEvent)
        break
    }
  }
}

watch(model, (value) => {
  void onEvent()
  void updateFormInput(value)
})

onMounted(async () => {
  await onEvent()
})

defineExpose({
  validate: updateFormInput,
})
</script>

<style lang="scss">
$inputPadding: calc($s_spacer * 2);

.s_textarea {
  display: block;
  width: 100%;

  &__input {
    @include s_borderRadius();
    width: 100%;
    height: auto;
    padding: $inputPadding calc($s_spacer * 4);
    font-size: 16px;
    color: s_getAppColor('text');
    outline: none;
    background-color: s_getAppColor('card');
    border: thin s_getAppColor('border') solid;

    &:focus {
      outline: 2px solid s_getAppColor('text');
    }

    &.s_disabled {
      background-color: transparent;
    }

    @each $name in $s_presetColorNames {
      &--#{$name} {
        color: s_getPresetColor($name, true);
        background-color: s_getPresetColor($name);
      }

      &Placeholder--#{$name} {
        &:placeholder-shown {
          color: s_getPresetColor($name, true);
          background-color: s_getPresetColor($name);
        }
      }
    }

    @each $name in $s_appExposedColorNames {
      &--#{$name} {
        color: s_getAppColor($name, true);
        background-color: s_getAppColor($name);
      }

      &Placeholder--#{$name} {
        &:placeholder-shown {
          color: s_getAppColor($name, true);
          background-color: s_getAppColor($name);
        }
      }
    }
  }

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
    color: s_getAppColor('secondaryText');
  }

  // The error message and the counter share the line under the field.
  &__details {
    display: flex;
    align-items: flex-start;
  }

  &__error {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__counter {
    @include s_typography('caption');
    flex: 0 0 auto;
    padding: $s_spacer calc($s_spacer * 4);
    margin-left: auto;
    color: s_getAppColor('secondaryText');
  }

  &--disabled {
    .s_textarea__label,
    .s_textarea__input {
      color: s_getAppColor('disabled');
    }
  }

  &--tile {
    .s_textarea__input {
      border-radius: 0;
    }
  }

  // Kept visible even when `hideError` / `hideDetails` hides the message text
  &--error .s_textarea__input {
    border-color: s_getPresetColor('error');

    &:focus {
      outline-color: s_getPresetColor('error');
    }
  }

  &--resize__none {
    resize: none;
  }

  &--dense {
    .s_textarea__input {
      padding: $inputPadding;
    }

    .s_textarea__label {
      padding: $s_spacer $inputPadding;
    }
  }
}
</style>
