<template>
  <section class="s_input" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="id" class="s_input__label">{{ label }}</label>
    <div class="s_input__container">
      <SRow no-gutters class="s_input__main" align="center">
        <div
          class="s_input__field"
          :class="{
            's_input__field--focus': isFocused,
            ...classListDisabled,
          }"
        >
          <input
            :id="id"
            v-bind="
              getCleanSetObject({
                'aria-labelledby': ariaLabelledby,
                autocapitalize,
                autocomplete,
                autofocus,
                disabled,
                inputmode,
                max: maxNumber,
                maxlength,
                min: minNumber,
                minlength,
                name,
                pattern,
                placeholder,
                readonly,
                spellcheck,
                type,
              })
            "
            ref="inputElement"
            :class="inputClassList"
            :style="inputStyleList"
            :value="displayValue"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @paste="onPaste"
            @keydown="onKeydown"
            @onautocomplete.prevent="onAutocompleteHandler"
          />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-if="$slots.suffix" class="s_input__suffix" @click="inputElement?.focus()"
            ><slot name="suffix"></slot
          ></span>
          <span v-else-if="suffix" class="s_input__suffix" @click="inputElement?.focus()">{{ suffix }}</span>
        </div>
        <SColumn
          v-if="simple"
          :cols="12"
          class="s_input__highlight"
          :class="{
            's_input__highlight--focus': isFocused && simple && !disabled,
            's_input__highlight--error': errors.length !== 0,
          }"
        ></SColumn>
      </SRow>
      <div v-if="$slots.appendOuter" class="s_input__appendOuter"><slot name="appendOuter"></slot></div>
      <div v-else-if="appendOuter" class="s_input__appendOuter">{{ appendOuter }}</div>
    </div>
    <kFormInputError v-if="!hideDetails" :errors="errors" :simple="simple"></kFormInputError>
  </section>
</template>
<script setup lang="ts">
import { SColumn, SRow } from '@khsura/sui/components/grids'
import { getNumericValue, getCleanSetObject } from '@khsura/sui/lib'
import { propsInput } from '@khsura/sui/props'
import { useColorRepository } from '@khsura/sui/repositories/colorRepository'
import { useDisabledService, useFormInputService, useSizeService } from '@khsura/sui/services'
import { type EmitFormTextInput } from '@khsura/sui/types'
import { computed } from 'vue'
import { useSlots } from 'vue'
import { ref } from 'vue'
import kFormInputError from './common/sFormInputError.vue'

const props = defineProps(propsInput())
const emit = defineEmits<EmitFormTextInput<string | number | null>>()
const slots = useSlots()
const inputElement = ref<HTMLElement | null>()
const model = defineModel<string | number | null>()
const { updateFormInput, errors } = useFormInputService<string | number | null>(props, emit)
const { classListDisabled } = useDisabledService(props)
// TODO: Sura - make able to use all preset colors
const { getIsPredefinedPresetColor } = useColorRepository()
const isPresetInputBackground = computed(() => getIsPredefinedPresetColor(props.inputBackground))
const isPresetPlaceholderBackground = computed(() => getIsPredefinedPresetColor(props.placeholderBackground ?? null))
const { classListSize } = useSizeService(props, { block: 'input__input' })
const isFocused = ref(false)

const classList = computed(() => {
  return {
    's_input--simple': props.simple,
    's_input--focus': isFocused.value,
    's_input--disabled': props.disabled,
    's_input--dense': props.dense,
    's_input--tile': props.tile,
    [`s_input--size__${props.size}`]: props.size,
  }
})

const inputClassList = computed(() => {
  return {
    s_input__input: true,
    's_input__input--simple': props.simple,
    's_input__input--textRight': props.textRight,
    [`s_input__input--${props.inputBackground}`]: !!isPresetInputBackground.value,
    [`s_input__inputPlaceholder--${props.placeholderBackground}`]: !!isPresetPlaceholderBackground.value,
    's_input__input--suffix': !!slots.suffix || props.suffix,
    ...classListSize.value,
  }
})

const inputStyleList = computed(() => {
  return {
    ...(!isPresetInputBackground.value ? { backgroundColor: props.inputBackground } : {}),
  }
})

let previousValue: number | null = null

const minNumber = computed(() => {
  return getNumericValue(props.min, { min: props.min, isPositive: props.positive })
})

const maxNumber = computed(() => {
  return getNumericValue(props.max, { max: props.max, isPositive: props.positive })
})

const displayValue = computed(() => {
  if (props.type !== 'number') {
    return props.modelValue
  }

  const value = getNumericValue(props.modelValue)

  if (value === 0) {
    return null
  }

  return value !== null && minNumber.value !== null && value <= minNumber.value ? null : (value?.toString() ?? null)
})

const getNormalizedValue = (value: number | string | null, max?: number | null) => {
  const maxValue = max ?? maxNumber.value

  if (value === null || value.toString().trim() === '') {
    return null
  }

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return null
  }

  if (numberValue <= 0 && props.positive) {
    return null
  }

  const intValue = parseInt(value.toString(), 10)
  const lowPassValue = minNumber.value !== null ? Math.max(intValue, minNumber.value) : intValue
  const highLowPassValue = maxValue ? Math.min(lowPassValue, Number(maxValue)) : lowPassValue

  return highLowPassValue
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.type === 'number') {
    const element = event.target as HTMLInputElement

    const getElementValue = () => {
      const numberValue = Number(element.value)

      return Number.isNaN(numberValue) ? null : numberValue
    }

    // disallow non-digit character such as `.`, `,`
    if (/^\D$/.test(event.key) && !(event.ctrlKey || event.metaKey)) {
      event.preventDefault()

      return
    }

    // disallow 0 input when input field is already empty
    if (!getElementValue() && event.key === '0') {
      event.preventDefault()

      return
    }
  }

  emit('keydown', event)
}

const fixInput = async (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const value = getNumericValue(inputElement.value)

  if (Number.isNaN(value) || inputElement.value === '') {
    inputElement.value = ''
    model.value = null
    await updateFormInput(null)
  } else if (
    (maxNumber.value !== null && value !== null && value > maxNumber.value) ||
    (minNumber.value !== null && value !== null && value < minNumber.value) ||
    /^0{1,}/.test(inputElement.value) ||
    !Number.isInteger(value)
  ) {
    const normalizedValue = getNormalizedValue(
      value ?? null,
      props.usePreviousValueWhenExceeded ? previousValue : maxNumber.value,
    )

    inputElement.value = normalizedValue?.toString() ?? ''
    model.value = normalizedValue
    await updateFormInput(normalizedValue)
    previousValue = normalizedValue
  } else {
    model.value = value
    await updateFormInput(value)
    previousValue = value
  }
}

const onInput = async (event: Event, preventChangeEvent = false) => {
  const value = (event.target as HTMLInputElement).value

  if (props.type === 'number') {
    await fixInput(event)
  } else {
    model.value = value
    await updateFormInput(value)
  }

  emit('input', event)

  if (!preventChangeEvent) {
    emit('change', model.value ?? null)
  }
}

const onAutocompleteHandler = (element: HTMLInputElement) => {
  emit('autocomplete', element)
}

const onFocus = async (event: Event) => {
  isFocused.value = true
  if (props.type === 'number') {
    await fixInput(event)
  }

  emit('focus', event)
}

const onBlur = async (event: Event) => {
  await onInput(event, true)
  isFocused.value = false
  emit('blur', event)
}

const onPaste = async (event: ClipboardEvent) => {
  if (props.isPasteDisabled) {
    event.preventDefault()
    emit('paste', event)

    return
  }

  if (props.type === 'number') {
    const element = event.target as HTMLInputElement | null

    if (!element) {
      return
    }

    event.preventDefault()
    const clipboardText = event.clipboardData?.getData('text/plain') ?? ''
    const maxInputLength = props.max?.toString().length

    const convertedNumber = getNumericValue(
      maxInputLength !== undefined && clipboardText.length > maxInputLength
        ? clipboardText.slice(0, maxInputLength)
        : clipboardText,
    )

    model.value = convertedNumber
    await updateFormInput(convertedNumber)
  }

  emit('paste', event)
}

defineExpose({
  validate: updateFormInput,
})
</script>

<style lang="scss">
$s_input--fontSizes: (
  'mini': 1rem,
  'small': 1rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
);
$inputPadding: calc($s_spacer * 2);

@mixin denseRightInput {
  &::placeholder {
    padding-right: $s_spacer;
  }
  padding: $inputPadding 0;
}

.s_input {
  display: block;
  width: 100%;

  &__container {
    display: flex;
    align-items: center;
  }

  &__field {
    @include s_borderRadius();
    position: relative;
    display: flex;
    flex: 1 0 auto;
    align-items: center;
    max-width: 100%;
    overflow: hidden;
    font-family: $s_inputFontFamily;
    line-height: 1.1;
    border: thin s_getAppColor('border') solid;

    &--focus {
      // Unfortuantly outline do not following the curve of border-radius below iOS 16.4,
      // Therefore we have to use ::before pseudo-element for outline effect on focus.
      // https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes
      &::before {
        position: absolute;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        pointer-events: none;
        content: '';
        border: 2px solid s_getAppColor('text');
        border-radius: 4px;
      }
    }

    &.s_disabled {
      background-color: transparent;
    }
  }

  &__highlight {
    width: 100%;
    height: 1px;
    margin-bottom: 1px;
    background-color: $s_color__black;

    &--focus {
      height: 2px;
      margin-bottom: 0;
      background-color: s_getPresetColor('info');
    }

    &--error {
      background-color: s_getPresetColor('error');
    }
  }

  &__input {
    width: 100%;
    padding: $inputPadding calc($s_spacer * 4);
    font-size: 16px;
    line-height: inherit;
    color: s_getAppColor('text');
    background-color: s_getAppColor('card');
    border: none;
    outline: none;

    &--textRight {
      padding: $inputPadding;
      text-align: right;

      &.s_input__input--suffix {
        @include denseRightInput();
      }
    }

    &:placeholder-shown {
      background-color: s_getAppColor('inputPlaceholderShown');
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

    &.s_input__input--simple {
      background-color: transparent;
      border: none;
      outline-color: transparent;

      &:placeholder-shown {
        background-color: transparent;
      }
    }
  }

  &__suffix {
    padding: 0 $inputPadding;
    font-size: 16px;
    white-space: nowrap;
    user-select: none;
  }

  &--size {
    @each $key, $size in $s_input--fontSizes {
      &__#{$key} {
        font-size: $size;

        .s_input__input,
        .s_input__suffix {
          font-size: $size;
        }
      }
    }
  }

  &__appendOuter {
    padding: $inputPadding;
    white-space: nowrap;
    user-select: none;
  }

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
    color: s_getAppColor('secondaryText');
  }

  &--disabled {
    .s_input__label,
    .s_input__suffix,
    .s_input__appendOuter {
      color: s_getAppColor('disabled');
    }

    .s_input__highlight {
      background-color: s_getAppColor('disabled');
    }
  }

  &--tile {
    .s_input__field {
      border-radius: 0;
    }
  }

  &--simple {
    .s_input__field {
      border: none;

      &--focus {
        outline: none;
      }
    }

    .s_input__label {
      padding: 0;
    }

    .s_input__appendOuter {
      margin-bottom: 2px;
    }

    .s_input__suffix {
      padding: 0 $inputPadding 0 0;
    }
  }

  &--dense {
    .s_input__input {
      padding: $inputPadding;
    }

    .s_input__label {
      padding: $s_spacer $inputPadding;
    }

    .s_input__input--textRight {
      @include denseRightInput();
    }

    .s_input__suffix {
      padding: 0 $inputPadding 0 0;
    }

    .s_input__appendOuter {
      padding: $inputPadding $s_spacer;
    }
  }
}
</style>
