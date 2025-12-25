<template>
  <section class="s_textarea" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="id" class="s_textarea__label">{{ label }}</label>
    <textarea
      :id="id"
      ref="textareaElement"
      v-bind="
        getCleanSetObject({
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
      @input="(event) => onEvent('input', event)"
      @blur="(event) => onEvent('blur', event)"
    />
    <kFormInputError v-if="!hideDetails" :errors="errors" :simple="simple"></kFormInputError>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import kFormInputError from './common/sFormInputError.vue'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import type { PropsTextarea } from '@/app/definitions'
import { useColorRepository } from '@/app/repositories/colorRepository'
import { useDisabledService, useFormInputService } from '@/app/services'
import { type EmitFormTextInput } from '@/app/types'

const props = withDefaults(defineProps<PropsTextarea<string>>(), {
  rows: 2,
  cols: 20,
})

const emit = defineEmits<EmitFormTextInput<string>>()
const textareaElement = ref<HTMLTextAreaElement | null>(null)

const model = defineModel<string>({
  get: (v) => v ?? '',
  default: '',
})

const { updateFormInput, errors } = useFormInputService<string>(props, emit, model)
const { classListDisabled } = useDisabledService(props)
// TODO - Sura: make able to use all preset colors
const { getIsPredefinedPresetColor } = useColorRepository()
const isPresetInputBackground = computed(() => getIsPredefinedPresetColor(props.inputBackground))
const isPresetPlaceholderBackground = computed(() => getIsPredefinedPresetColor(props.placeholderBackground ?? null))
const textareaHeight = ref<string | null>(null)

const classList = computed(() => {
  return {
    's_textarea--disabled': props.disabled,
    's_textarea--dense': props.dense,
    's_textarea--tile': props.tile,
    [`s_textarea--size__${props.size}`]: props.size,
    ...classListDisabled.value,
  }
})

const inputClassList = computed(() => {
  return {
    s_textarea__input: true,
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

const onEvent = async (name?: 'input' | 'blur', event?: Event) => {
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
        emit(name, event)
        break
      case 'input':
        emit(name, event)
        emit('change', model.value ?? '')
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
  }

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
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
