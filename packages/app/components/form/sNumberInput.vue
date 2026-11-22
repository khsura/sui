<template>
  <section class="s_numberInput" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_numberInput__label">{{ label }}</label>
    <div class="s_numberInput__field" :class="fieldClassList">
      <button
        v-if="isSplit"
        type="button"
        tabindex="-1"
        class="s_numberInput__control s_numberInput__control--decrement"
        :aria-label="decrementLabel"
        :aria-controls="inputId"
        :disabled="!canDecrement"
        @mousedown.prevent
        @click="onStep(-1)"
      >
        <SIcon :icon="numberInputDecrementIcon" />
      </button>
      <span v-if="prefix" class="s_numberInput__affix s_numberInput__affix--prefix" @click="focusInput">{{
        prefix
      }}</span>
      <input
        :id="inputId"
        ref="inputElement"
        v-bind="
          getCleanSetObject({
            ...ariaAttributesFormInput,
            'aria-label': ariaLabel ?? (hideDetails ? label : undefined),
            'aria-labelledby': ariaLabelledby,
            'aria-valuemin': bounds.min,
            'aria-valuemax': bounds.max,
            'aria-valuenow': model,
            'aria-readonly': readonly || undefined,
            autofocus,
            disabled,
            name,
            placeholder,
            readonly,
          })
        "
        class="s_numberInput__input"
        type="text"
        role="spinbutton"
        autocomplete="off"
        :inputmode="inputMode"
        :value="text"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <span v-if="suffix" class="s_numberInput__affix s_numberInput__affix--suffix" @click="focusInput">{{
        suffix
      }}</span>
      <div v-if="isStacked" class="s_numberInput__stack">
        <button
          type="button"
          tabindex="-1"
          class="s_numberInput__control s_numberInput__control--increment"
          :aria-label="incrementLabel"
          :aria-controls="inputId"
          :disabled="!canIncrement"
          @mousedown.prevent
          @click="onStep(1)"
        >
          <SIcon :icon="numberInputStackedIncrementIcon" size="small" />
        </button>
        <button
          type="button"
          tabindex="-1"
          class="s_numberInput__control s_numberInput__control--decrement"
          :aria-label="decrementLabel"
          :aria-controls="inputId"
          :disabled="!canDecrement"
          @mousedown.prevent
          @click="onStep(-1)"
        >
          <SIcon :icon="numberInputStackedDecrementIcon" size="small" />
        </button>
      </div>
      <button
        v-if="isSplit"
        type="button"
        tabindex="-1"
        class="s_numberInput__control s_numberInput__control--increment"
        :aria-label="incrementLabel"
        :aria-controls="inputId"
        :disabled="!canIncrement"
        @mousedown.prevent
        @click="onStep(1)"
      >
        <SIcon :icon="numberInputIncrementIcon" />
      </button>
    </div>
    <SFormInputError v-if="!hideDetails && !hideError" :id="errorId" :errors="errors"></SFormInputError>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SFormInputError } from './common'
import SIcon from '@/app/components/sIcon.vue'
import {
  keyboardKey,
  numberInputDecrementIcon,
  numberInputDecrementLabel,
  numberInputDefaultControlVariant,
  numberInputDefaultPrecision,
  numberInputDefaultStep,
  numberInputIncrementIcon,
  numberInputIncrementLabel,
  numberInputStackedDecrementIcon,
  numberInputStackedIncrementIcon,
} from '@/app/constants'
import type { PropsNumberInput } from '@/app/definitions'
import {
  getCleanSetObject,
  getClampedNumber,
  getDecimalCount,
  getIsNumberTextAllowed,
  getNormalizedNumber,
  getNumberText,
  getOptionalNumber,
  getParsedNumberText,
} from '@/app/lib'
import {
  useComponentDefaultsService,
  useDensityService,
  useDisabledService,
  useFieldLayoutService,
  useFormInputService,
  useSizeService,
} from '@/app/services'
import { type EmitNumberInput, type NumberInputBounds } from '@/app/types'

const rawProps = defineProps<PropsNumberInput>()
const props = useComponentDefaultsService('SNumberInput', rawProps)
const { classListDensity } = useDensityService(props)
const emit = defineEmits<EmitNumberInput>()
const model = defineModel<number | null>({ default: null })
const inputElement = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const { updateFormInput, errors, hasError, inputId, errorId, ariaAttributesFormInput } = useFormInputService<
  number | null
>(props, emit, model)

const { classListDisabled } = useDisabledService(props)
const { classListSize } = useSizeService(props, { block: 'numberInput' })

const { classListField } = useFieldLayoutService(
  computed(() => ({
    hasLabel: !!props.label && !props.hideDetails,
    hasDetails: !props.hideDetails && !props.hideError,
  })),
)

const stepSize = computed(() => {
  const stepValue = getOptionalNumber(props.step)

  return stepValue !== null && stepValue > 0 ? stepValue : numberInputDefaultStep
})

// A step finer than `precision` (0.5 with whole numbers) would be rounded away, so the step's decimals win.
const bounds = computed<NumberInputBounds>(() => {
  const precision = props.precision === undefined ? numberInputDefaultPrecision : props.precision

  return {
    min: getOptionalNumber(props.min),
    max: getOptionalNumber(props.max),
    precision: precision === null ? null : Math.max(precision, getDecimalCount(stepSize.value)),
  }
})

const allowNegative = computed(() => bounds.value.min === null || bounds.value.min < 0)

// A phone's numeric keypad has no minus sign, so a field that accepts negatives keeps the full keyboard.
const inputMode = computed(() => {
  if (allowNegative.value) {
    return 'text'
  }

  return bounds.value.precision === 0 ? 'numeric' : 'decimal'
})

const activeControlVariant = computed(() => props.controlVariant ?? numberInputDefaultControlVariant)
const isStacked = computed(() => !props.hideControls && activeControlVariant.value === 'stacked')
const isSplit = computed(() => !props.hideControls && activeControlVariant.value === 'split')
const incrementLabel = computed(() => props.incrementAriaLabel ?? numberInputIncrementLabel)
const decrementLabel = computed(() => props.decrementAriaLabel ?? numberInputDecrementLabel)
const text = ref(getNumberText(model.value, bounds.value.precision))
const isEditable = computed(() => !props.disabled && !props.readonly)

const canIncrement = computed(() => {
  const { max } = bounds.value

  return isEditable.value && (max === null || model.value === null || model.value < max)
})

const canDecrement = computed(() => {
  const { min } = bounds.value

  return isEditable.value && (min === null || model.value === null || model.value > min)
})

// A value set from outside replaces the text; while focused, text that already means the value (`1.` for 1) stays.
watch([model, () => bounds.value.precision], ([value, precision]) => {
  if (!isFocused.value || getParsedNumberText(text.value) !== value) {
    text.value = getNumberText(value, precision)
  }
})

const classList = computed(() => ({
  ...classListField.value,
  ...classListDensity.value,
  ...classListSize.value,
  's_numberInput--disabled': props.disabled,
  's_numberInput--dense': props.dense,
  's_numberInput--tile': props.tile,
  's_numberInput--split': isSplit.value,
  's_numberInput--textRight': props.textRight,
}))

const fieldClassList = computed(() => ({
  's_numberInput__field--focus': isFocused.value,
  's_numberInput__field--error': hasError.value,
  ...classListDisabled.value,
}))

const setValue = async (value: number | null) => {
  if (value !== model.value) {
    model.value = value
  }

  await updateFormInput(value)
}

const focusInput = () => {
  inputElement.value?.focus()
}

const onInput = async () => {
  const element = inputElement.value

  if (!element) {
    return
  }

  // Refused text (a letter, a second `.`, too many decimals) is put back, so the field never shows it.
  if (
    !getIsNumberTextAllowed(element.value, { allowNegative: allowNegative.value, precision: bounds.value.precision })
  ) {
    element.value = text.value

    return
  }

  text.value = element.value
  await setValue(getParsedNumberText(element.value))
}

const onStep = async (direction: 1 | -1) => {
  if (!(direction > 0 ? canIncrement.value : canDecrement.value)) {
    return
  }

  const current = getParsedNumberText(text.value) ?? model.value

  // Without a precision, a sum keeps the decimals of its parts, so 0.1 + 0.2 gives 0.3 rather than binary noise.
  const stepPrecision =
    bounds.value.precision ?? Math.max(getDecimalCount(current ?? 0), getDecimalCount(stepSize.value))

  // An empty field starts from 0, or from the nearest bound when 0 is out of range.
  const value =
    current === null
      ? getClampedNumber(0, bounds.value)
      : getNormalizedNumber(current + direction * stepSize.value, { ...bounds.value, precision: stepPrecision })

  text.value = getNumberText(value, bounds.value.precision)
  await setValue(value)
}

const onKeydown = async (event: KeyboardEvent) => {
  emit('keydown', event)

  if (event.key === keyboardKey.arrowUp || event.key === keyboardKey.arrowDown) {
    event.preventDefault()
    await onStep(event.key === keyboardKey.arrowUp ? 1 : -1)
  }
}

const onFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

// Clamps and rounds what was typed, then shows it with the fixed number of decimals.
const onBlur = async (event: FocusEvent) => {
  isFocused.value = false

  const parsedValue = getParsedNumberText(text.value)
  const value = parsedValue === null ? null : getNormalizedNumber(parsedValue, bounds.value)

  text.value = getNumberText(value, bounds.value.precision)

  if (inputElement.value) {
    inputElement.value.value = text.value
  }

  await setValue(value)
  emit('blur', event)
}

defineExpose({
  validate: updateFormInput,
})
</script>
<style lang="scss">
$s_numberInput--fontSizes: (
  'mini': 1rem,
  'small': 1rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
) !default;
$s_numberInput--fontSize: 1rem !default;
$s_numberInput--padding: calc($s_spacer * 2) !default;
$s_numberInput--inlinePadding: calc($s_spacer * 4) !default;
$s_numberInput--controlWidth: calc($s_spacer * 8) !default;
$s_numberInput--stackWidth: calc($s_spacer * 6) !default;
$s_numberInput--inputMinWidth: calc($s_spacer * 16) !default;
// The SInput field height: 16px text at line-height 1.1, 8px vertical padding and a 1px border.
$s_numberInput--densityFieldHeight: calc(16px * 1.1 + #{$s_spacer * 4} + 2px) !default;

.s_numberInput {
  @include s_dark();
  display: block;
  width: 100%;

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer $s_numberInput--inlinePadding;
    color: s_getAppColor('secondaryText');
  }

  &__field {
    @include s_borderRadius();
    position: relative;
    display: flex;
    align-items: stretch;
    max-width: 100%;
    overflow: hidden;
    font-family: $s_inputFontFamily;
    line-height: 1.1;
    background-color: s_getAppColor('card');
    border: thin s_getAppColor('border') solid;

    // A pseudo-element rather than `outline`, which ignores border-radius below iOS 16.4 (as on SInput).
    &--focus::before {
      position: absolute;
      inset: -1px;
      pointer-events: none;
      content: '';
      border: 2px solid s_getAppColor('text');
      border-radius: inherit;
    }

    // Kept visible even when `hideError` / `hideDetails` hides the message text
    &--error {
      border-color: s_getPresetColor('error');

      &::before {
        border-color: s_getPresetColor('error');
      }
    }

    &.s_disabled {
      background-color: transparent;
    }
  }

  &__input {
    // No intrinsic width (an <input> asks for 20 characters), so in SFormRow a number field leaves room for the
    // button beside it and grows into the free space instead.
    flex: 1 1 auto;
    width: 0;
    min-width: $s_numberInput--inputMinWidth;
    padding: $s_numberInput--padding $s_numberInput--inlinePadding;
    font-size: $s_numberInput--fontSize;
    line-height: inherit;
    color: s_getAppColor('text');
    outline: none;
    background-color: transparent;
    border: none;

    &::placeholder {
      color: s_getAppColor('secondaryText');
    }
  }

  &__affix {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    color: s_getAppColor('secondaryText');
    white-space: nowrap;
    user-select: none;

    &--prefix {
      padding-left: $s_numberInput--inlinePadding;

      + .s_numberInput__input {
        padding-left: $s_spacer;
      }
    }

    &--suffix {
      padding-right: $s_numberInput--padding;
    }
  }

  &__input:has(+ .s_numberInput__affix--suffix) {
    padding-right: $s_spacer;
  }

  &__stack {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    width: $s_numberInput--stackWidth;
    border-left: thin s_getAppColor('border') solid;

    .s_numberInput__control {
      flex: 1 1 0;
      width: 100%;
      min-height: 0;

      + .s_numberInput__control {
        border-top: thin s_getAppColor('border') solid;
      }
    }
  }

  &__control {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: $s_numberInput--controlWidth;
    padding: 0;
    color: s_getAppColor('text');
    cursor: pointer;
    background-color: transparent;
    border: none;

    &:hover:not(:disabled) {
      background-color: s_getAppColor('hover');
    }

    &:disabled {
      color: s_getAppColor('disabled');
      cursor: default;
    }
  }

  &--split {
    .s_numberInput__input {
      text-align: center;
    }

    .s_numberInput__control--decrement {
      border-right: thin s_getAppColor('border') solid;
    }

    .s_numberInput__control--increment {
      border-left: thin s_getAppColor('border') solid;
    }
  }

  &--textRight .s_numberInput__input {
    text-align: right;
  }

  &--size {
    @each $name, $fontSize in $s_numberInput--fontSizes {
      &__#{$name} {
        .s_numberInput__input,
        .s_numberInput__affix {
          font-size: $fontSize;
        }
      }
    }
  }

  &--disabled {
    .s_numberInput__label,
    .s_numberInput__affix {
      color: s_getAppColor('disabled');
    }
  }

  &--tile .s_numberInput__field {
    border-radius: 0;
  }

  &--dense {
    .s_numberInput__input {
      padding: $s_numberInput--padding;
    }

    .s_numberInput__label {
      padding: $s_spacer $s_numberInput--padding;
    }
  }

  // Density: one step removes 4px of field height (2px top + bottom), as SInput.
  @include s_density() {
    // A fixed field height (the SInput field formula, less the density offset) instead of padding: the
    // input's `1rem` text would otherwise follow the root font size and miss SButton's height.
    .s_numberInput__field {
      height: calc(#{$s_numberInput--densityFieldHeight} + var(--s-density-offset));
    }

    .s_numberInput__input {
      padding-block: 0;
    }

    // The two stacked arrows would otherwise hold the field at its default height: size containment
    // lets the stack take the (shorter) field height instead of its content's.
    .s_numberInput__stack {
      contain: size;

      .s_numberInput__control {
        overflow: hidden;
      }
    }
  }
}
</style>
