<template>
  <div class="s_datePickerInput" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_datePickerInput__label">{{ label }}</label>
    <div ref="activatorElement" class="s_datePickerInput__field" :class="fieldClasses">
      <input
        :id="inputId"
        class="s_datePickerInput__input"
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
import type { PropsDatePickerInput, PropsMenu } from '@/app/definitions'
import { datePickerDisplayFormat, datePickerModelFormats } from '@/app/configs'
import { useComponentDefaultsService, useFormInputService, useMenuService } from '@/app/services'
import type { EmitFormInput } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

const rawProps = withDefaults(defineProps<PropsDatePickerInput>(), {
  type: 'date',
  today: () => dayjs().format('YYYY-MM-DD'),
  dateFormat: datePickerDisplayFormat.date,
  monthFormat: datePickerDisplayFormat.month,
  yearFormat: datePickerDisplayFormat.year,
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

const { contentClasses, contentStyles, updateLocation } = useMenuService(
  { ...props, location: 'bottom' } as unknown as PropsMenu,
  menuModel,
  { activatorElement, contentElement },
)

const closeMenu = () => {
  menuModel.value = false
}

onClickOutside(contentElement, closeMenu, { ignore: [activatorElement] })

const inputFormat = computed(() => datePickerModelFormats[props.type])
const localText = ref(model.value ?? '')
const isEditing = ref(false)

watch(
  () => model.value,
  (val) => {
    if (!isEditing.value) localText.value = val ?? ''
  },
  { immediate: true },
)

const inputText = computed(() => (isEditing.value ? localText.value : (model.value ?? '')))

const classList = computed(() => ({
  's_datePickerInput--disabled': props.disabled,
  's_datePickerInput--dense': props.dense,
  's_datePickerInput--simple': props.simple,
  's_datePickerInput--tile': props.tile,
  [`s_datePickerInput--size__${props.size}`]: props.size,
}))

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
</script>
<style lang="scss">
$s_datePickerInput--fontSizes: (
  'mini': 0.875rem,
  'small': 0.875rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
);

.s_datePickerInput {
  display: block;
  width: 100%;

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
    flex: 1;
    width: 100%;
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
