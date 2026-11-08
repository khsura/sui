<template>
  <div class="s_switch" :class="switchClasses">
    <input
      :id="inputId"
      v-model="modelValue"
      type="checkbox"
      role="switch"
      class="s_switch__input"
      :disabled="props.disabled ?? false"
      :aria-readonly="props.readonly || undefined"
      @click="preventReadonlyToggle"
    />
    <div
      :key="`${modelValue}`"
      class="s_switch__button"
      :style="switchButtonStyleList"
      :class="switchButtonClasses"
      @click="toggle"
    ></div>
    <label v-if="label || $slots.label" class="s_switch__label" :for="inputId" :class="switchLabelClasses">
      <slot name="label">{{ label }}</slot>
    </label>
  </div>
</template>
<script setup lang="ts">
import { computed, useId } from 'vue'
import { CssColor } from '@/app/constants'
import type { PropsSwitch } from '@/app/definitions'
import { useColorService, useComponentDefaultsService, useDisabledService } from '@/app/services'

const rawProps = defineProps<PropsSwitch>()
const props = useComponentDefaultsService('SSwitch', rawProps)
const modelValue = defineModel<boolean>()
const { classListDisabled, classListTextDisabled } = useDisabledService(props)
const { colorVariable } = useColorService(props)
const innerId = useId()
const inputId = computed(() => props.id ?? innerId)

const switchClasses = computed(() => {
  return {
    's_switch--selected': modelValue.value,
  }
})

const backgroundColor = computed(() => {
  if (modelValue.value) {
    return colorVariable.value ?? 'var(--s-color-primary)'
  }

  return CssColor.chinesesilver
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

// A readonly switch looks interactive to the keyboard, so cancel the native toggle
const preventReadonlyToggle = (event: MouseEvent) => {
  if (props.readonly) {
    event.preventDefault()
  }
}
</script>

<style lang="scss">
.s_switch {
  position: relative;
  display: inline-flex;
  // A label that wraps grows downward from the button's line, not around it.
  align-items: flex-start;

  // Hidden from sight only: it stays in the accessibility tree and the Tab
  // order. `position: relative` above keeps it in place, so focus never scrolls.
  &__input {
    @include s_visuallyHidden();
  }

  &__button {
    @include s_borderRadius('pill');
    position: relative;
    display: inline-block;
    // Never squeezed by a label that wraps: a flex item shrinks by default,
    // and a two-line label took the button from 40px down to 30px.
    flex-shrink: 0;
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
      background-color: s_getAppColor('switch');

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
    // The button's height, so a one-line label sits centred on it as before.
    line-height: 24px;
    cursor: pointer;
  }

  // Keyboard focus only, so a mouse click does not leave a ring behind
  &__input:focus-visible + &__button {
    outline: 2px solid s_getPresetColor('info');
    outline-offset: 2px;
  }
}
</style>
