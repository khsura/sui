<template>
  <div class="s_datePickerInput" :class="classList">
    <SButton
      v-if="carousel"
      variant="icon"
      class="s_datePickerInput__carouselButton"
      :aria-label="carouselPrevAriaLabel"
      :disabled="!canStepPrev"
      @click="onStepPrev"
    >
      <SIcon :icon="carouselPrevIcon" />
    </SButton>
    <div class="s_datePickerInput__content">
      <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_datePickerInput__label">{{ label }}</label>
      <div ref="activatorElement" class="s_datePickerInput__field" :class="fieldClasses">
        <input
          :id="inputId"
          class="s_datePickerInput__input"
          :size="inputSize"
          :value="inputText"
          :placeholder="placeholder ?? inputFormat"
          :disabled="disabled ?? undefined"
          :readonly="readonly ?? undefined"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown.enter.prevent="commitInput"
        />
        <span class="s_datePickerInput__suffix" @mousedown.prevent @click="toggleMenu">
          <SIcon icon="mdi-calendar" />
        </span>
      </div>
      <SFormInputError v-if="!hideDetails && !hideError" :errors="errors" />
    </div>
    <SButton
      v-if="carousel"
      variant="icon"
      class="s_datePickerInput__carouselButton"
      :aria-label="carouselNextAriaLabel"
      :disabled="!canStepNext"
      @click="onStepNext"
    >
      <SIcon :icon="carouselNextIcon" />
    </SButton>

    <SOverlay v-slot="{ attrs }" :value="menuModel">
      <div
        ref="contentElement"
        class="s_datePickerInput__picker"
        :class="contentClasses"
        :style="contentStyles"
        v-bind="attrs"
      >
        <SDatePicker
          :model-value="model ?? undefined"
          :type="type"
          :color="color"
          :min="min"
          :max="max"
          :dense="dense"
          :today="today"
          :date-format="dateFormat"
          :month-format="monthFormat"
          :year-format="yearFormat"
          width="280"
          hide-title
          @update:model-value="model = $event ?? null"
          @change="onPickerChange"
        />
      </div>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import SDatePicker from './sDatePicker.vue'
import SFormInputError from '@/app/components/form/common/sFormInputError.vue'
import SIcon from '@/app/components/sIcon.vue'
import SOverlay from '@/app/components/sOverlay.vue'
import SButton from '@/app/components/sButton.vue'
import type { PropsDatePickerInput, PropsMenu } from '@/app/definitions'
import { datePickerDisplayFormat } from '@/app/configs'
import { convertDatePickerValue } from '@/app/repositories'
import {
  useComponentDefaultsService,
  useDatePickerInputService,
  useFormInputService,
  useMenuService,
} from '@/app/services'
import type { EmitFormInput } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

const rawProps = withDefaults(defineProps<PropsDatePickerInput>(), {
  type: 'date',
  today: () => dayjs().format('YYYY-MM-DD'),
  dateFormat: datePickerDisplayFormat.date,
  monthFormat: datePickerDisplayFormat.month,
  yearFormat: datePickerDisplayFormat.year,
  carouselPrevIcon: 'mdi-chevron-left',
  carouselNextIcon: 'mdi-chevron-right',
  carouselPrevAriaLabel: 'Previous',
  carouselNextAriaLabel: 'Next',
})

const props = useComponentDefaultsService('SDatePickerInput', rawProps)
const emit = defineEmits<EmitFormInput<string | null>>()
const model = defineModel<string | null>()
const menuModel = ref(false)
const uniqueId = useId()
const inputId = computed(() => props.id ?? uniqueId)
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')
const { errors, updateFormInput } = useFormInputService<string | null>(props, emit, model)
const { inputFormat, canStepPrev, canStepNext, stepPrev, stepNext } = useDatePickerInputService(props, model)

const { contentClasses, contentStyles, updateLocation } = useMenuService(
  { ...props, location: 'bottom' } as unknown as PropsMenu,
  menuModel,
  { activatorElement, contentElement },
)

const closeMenu = () => {
  menuModel.value = false
}

onClickOutside(contentElement, closeMenu, { ignore: [activatorElement] })

const localText = ref(model.value ?? '')
const isEditing = ref(false)
/** The committed value expressed in the format of the current type. */
const formattedValue = computed(() => convertDatePickerValue(model.value, props.type))

watch(
  formattedValue,
  (val) => {
    if (!isEditing.value) {
      localText.value = val ?? ''
    }
  },
  { immediate: true },
)

const inputText = computed(() => (isEditing.value ? localText.value : (formattedValue.value ?? '')))

const classList = computed(() => ({
  's_datePickerInput--disabled': props.disabled,
  's_datePickerInput--dense': props.dense,
  's_datePickerInput--simple': props.simple,
  's_datePickerInput--tile': props.tile,
  [`s_datePickerInput--size__${props.size}`]: props.size,
}))

/** Number of characters the value of the current type needs. */
const inputSize = computed(() => inputFormat.value.length)

/**
 * Keeps the committed value in the format of the current type.
 * A date value of `2026-10-21` becomes `2026-10` for the month type and `2026` for the year type.
 */
const syncModelWithType = () => {
  const value = model.value

  if (!value) {
    return
  }

  const converted = convertDatePickerValue(value, props.type)

  if (converted !== value) {
    model.value = converted
  }
}

const fieldClasses = computed(() => ({
  's_datePickerInput__field--focus': isEditing.value,
  's_datePickerInput__field--error': errors.value.length > 0,
}))

const commitInput = async () => {
  const text = localText.value.trim()

  if (!text) {
    model.value = null
    await updateFormInput(null)

    return
  }

  const parsed = dayjs(text, inputFormat.value, true)

  if (parsed.isValid()) {
    const formatted = parsed.format(inputFormat.value)

    model.value = formatted
    await updateFormInput(formatted)
  } else {
    localText.value = model.value ?? ''
  }
}

const onInput = (event: Event) => {
  localText.value = (event.target as HTMLInputElement).value
}

const onFocus = () => {
  localText.value = model.value ?? ''
  isEditing.value = true
  menuModel.value = true
}

const onBlur = async () => {
  isEditing.value = false
  await commitInput()
}

const onPickerChange = async () => {
  menuModel.value = false
  localText.value = model.value ?? ''
  await updateFormInput(model.value ?? null)
}

const toggleMenu = () => {
  menuModel.value = !menuModel.value
}

watch(menuModel, async () => {
  if (menuModel.value) {
    await nextTick()
    updateLocation()
  }
})

const applyStep = async (value: string | undefined) => {
  if (value === undefined) {
    return
  }

  model.value = value
  localText.value = value
  await updateFormInput(value)
}

const onStepPrev = async () => {
  await applyStep(stepPrev())
}

const onStepNext = async () => {
  await applyStep(stepNext())
}

watch(
  () => props.type,
  () => {
    syncModelWithType()
  },
  { immediate: true },
)
</script>
<style lang="scss">
// The font size never goes below 16px, a smaller one makes the browser zoom in on focus.
$s_datePickerInput--fontSizes: (
  'mini': 1rem,
  'small': 1rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
);

.s_datePickerInput {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  width: 100%;

  &__content {
    flex: 1 1 auto;
    // The field must never shrink below the width the value needs.
    min-width: min-content;
  }

  &__carouselButton {
    flex: 0 0 auto;
  }

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
    color: s_getAppColor('secondaryText');
  }

  &__field {
    @include s_borderRadius();
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    font-family: $s_inputFontFamily;
    line-height: 1.1;
    border: thin s_getAppColor('border') solid;

    &--focus {
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

    &--error {
      &::before {
        position: absolute;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        pointer-events: none;
        content: '';
        border: 2px solid s_getPresetColor('error');
        border-radius: 4px;
      }
    }
  }

  &__input {
    flex: 1 1 auto;
    width: auto;
    // The `size` attribute reserves the width of the value, it follows the font size.
    min-width: auto;
    padding: calc($s_spacer * 2) calc($s_spacer * 4);
    font-size: 1rem;
    line-height: inherit;
    color: s_getAppColor('text');
    outline: none;
    background-color: s_getAppColor('card');
    border: none;

    &:placeholder-shown {
      background-color: s_getAppColor('inputPlaceholderShown');
    }

    &:disabled {
      cursor: not-allowed;
      background-color: transparent;
    }
  }

  &__suffix {
    display: flex;
    align-items: center;
    height: stretch;
    padding: 0 calc($s_spacer * 2);
    cursor: pointer;
    user-select: none;
    background-color: s_getAppColor('card');
  }

  &__picker {
    @include s_menuContent();
    @include s_elevation(2);
  }

  @each $key, $size in $s_datePickerInput--fontSizes {
    &--size__#{$key} {
      .s_datePickerInput__input,
      .s_datePickerInput__suffix {
        font-size: $size;
      }
    }
  }

  &--dense {
    .s_datePickerInput__input {
      padding: calc($s_spacer * 1) calc($s_spacer * 2);
    }

    .s_datePickerInput__label {
      padding: $s_spacer calc($s_spacer * 2);
    }
  }

  &--simple {
    .s_datePickerInput__field {
      border: none;

      &--focus::before {
        display: none;
      }
    }

    .s_datePickerInput__input {
      background-color: transparent;

      &:placeholder-shown {
        background-color: transparent;
      }
    }

    .s_datePickerInput__suffix {
      background-color: transparent;
    }

    .s_datePickerInput__label {
      padding: 0;
    }
  }

  &--tile {
    .s_datePickerInput__field {
      border-radius: 0;
    }
  }

  &--disabled {
    .s_datePickerInput__label,
    .s_datePickerInput__suffix {
      color: s_getAppColor('disabled');
    }
  }
}
</style>
