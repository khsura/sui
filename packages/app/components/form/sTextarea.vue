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
import { propsTextarea } from '@sui/app/props'
import { getIsPresetColor } from '@sui/app/repositories/colorRepository'
import { useDisabledService, useFormInputService } from '@sui/app/services'
import kFormInputError from './common/sFormInputError.vue'
import { getCleanSetObject, getNumericCssAttribute } from '@sui/app/lib'
import { type EmitFormTextInput } from '@sui/app/types'
import { ref } from 'vue'
import { computed } from 'vue'
import { nextTick } from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue'

const props = defineProps(propsTextarea())
const emit = defineEmits<EmitFormTextInput<string | number | null>>()
const textareaElement = ref<HTMLTextAreaElement | null>(null)
const { updateFormInput, errors } = useFormInputService<string | number | null>(props, emit)
const { classListDisabled } = useDisabledService(props)
const isPresetInputBackground = computed(() => getIsPresetColor(props.inputBackground))
const isPresetPlaceholderBackground = computed(() => getIsPresetColor(props.placeholderBackground ?? null))
const textareaHeight = ref<string | null>(null)

const model = computed({
  get() {
    return props.modelValue ?? ''
  },
  set(value) {
    void updateFormInput(value)
  },
})

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
      textareaHeight.value = getNumericCssAttribute(textareaElement.value.scrollHeight)
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
        break
    }
  }
}

onMounted(async () => {
  await onEvent()
})

watch(model, async () => {
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
    background-color: s_getAppColor('card');
    border: thin s_getAppColor('border') solid;
    outline: none;

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
