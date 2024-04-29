<template>
  <div class="s_switch" :class="switchClasses">
    <input :id="id" v-model="modelValue" type="checkbox" class="s_switch__input" />
    <div class="s_switch__button" :style="switchButtonStyleList" :class="switchButtonClasses" @click="toggle"></div>
    <label v-if="label || $slots.label" class="s_switch__label" :for="id" :class="switchLabelClasses">
      <slot name="label">{{ label }}</slot>
    </label>
  </div>
</template>
<script setup lang="ts">
import { cssColors } from '@sui/app/constants/color'
import { propsFormInput } from '@sui/app/props'
import { getIsPresetColor } from '@sui/app/repositories/colorRepository'
import { useDisabledService, useModelService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  ...propsFormInput<boolean>({ modelValue: { required: true } }),
  color: {
    type: String,
    default: 'primary',
  },
})

const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>()

const modelValue = useModelService(props, emit)
const { classListDisabled, classListTextDisabled } = useDisabledService(props)

const switchClasses = computed(() => {
  return {
    's_switch--selected': modelValue.value,
  }
})

const backgroundColor = computed(() => {
  if (modelValue.value) {
    if (getIsPresetColor(props.color)) {
      return `var(--s-color-${props.color})`
    } else if (cssColors[props.color]) {
      return cssColors[props.color]
    } else if (Object.values(cssColors).includes(props.color)) {
      return props.color
    }

    return 'var(--s-color-primary)'
  }

  return cssColors.chinesesilver
})

const switchButtonClasses = computed(() => {
  return {
    's_switch__button--selected': modelValue.value,
    ...classListDisabled.value,
  }
})

const switchButtonStyleList = computed(() => {
  return {
    backgroundColor: backgroundColor.value,
  }
})

const switchLabelClasses = computed(() => {
  return {
    ...classListTextDisabled.value,
  }
})

const toggle = () => {
  modelValue.value = !modelValue.value
}
</script>

<style lang="scss">
.s_switch {
  display: inline-flex;
  align-items: center;

  &__input {
    display: none;
  }

  &__button {
    @include s_borderRadius('pill');
    position: relative;
    display: inline-block;
    width: 40px;
    max-width: 100%;
    height: 24px;
    cursor: pointer;
    background-color: s_getAppColor('border');
    transition: 0.2s;

    &::before {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      content: '';
      background-color: s_getAppColor('card');

      @include s_borderRadius('circle');
    }

    &--selected {
      &::before {
        top: 2px;
        right: 2px;
        left: auto;
        background-color: s_getPresetColor('primary', true);
      }
    }
  }

  &__label {
    margin-left: calc($s_spacer * 3);
    cursor: pointer;
  }
}
</style>
