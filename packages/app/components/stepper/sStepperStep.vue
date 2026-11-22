<template>
  <!-- An editable step is a button: a Tab stop that Enter or Space activates -->
  <div
    :class="classList"
    v-bind="interactiveAttrs"
    :aria-current="isCurrent ? 'step' : undefined"
    @click="goToStep"
    @keydown.enter.prevent="goToStep"
    @keydown.space.prevent="goToStep"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      class="s_stepperStep__checkmark"
    >
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
    </svg>
    <div class="s_stepperStep__content"><slot></slot></div>
  </div>
</template>
<script setup lang="ts">
import { inject, watch, onMounted, onUnmounted, computed } from 'vue'
import { ProviderName, ProviderPropsName } from '@/app/configs'
import type { PropsStepperStep } from '@/app/definitions'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps<PropsStepperStep>()
const props = useComponentDefaultsService('SStepperStep', rawProps)
const stepperStepsProp = inject(ProviderPropsName.stepperProps, null)

if (!stepperStepsProp) {
  throw new Error('Stepper props not found')
}

const registerStep = inject(ProviderName.stepperRegisterStepperStep, (_: number) => true)
const unregisterStep = inject(ProviderName.stepperUnregisterStepperStep, (_: number) => true)
const updateStepperStepsValue = inject(ProviderName.stepperUpdateValue, (_: number) => true)

watch(
  () => props.step,
  (s, p) => {
    unregisterStep(p)
    registerStep(s)
  },
)

onMounted(() => registerStep(props.step))
onUnmounted(() => unregisterStep(props.step))

const isVisited = computed(() => {
  return stepperStepsProp.modelValue && stepperStepsProp.modelValue > props.step
})

const isCurrent = computed(() => {
  return stepperStepsProp.modelValue === props.step
})

const classList = computed(() => {
  return {
    s_stepperStep: true,
    's_stepperStep--visited': isVisited.value,
    's_stepperStep--current': isCurrent.value,
    's_stepperStep--editable': props.editable,
    's_stepperStep--disabled': props.disabled,
  }
})

const isInteractive = computed(() => !!props.editable && !props.disabled)

const interactiveAttrs = computed(() =>
  isInteractive.value ? { role: 'button', tabindex: 0 } : { 'aria-disabled': props.disabled || undefined },
)

const goToStep = () => {
  if (isInteractive.value) {
    updateStepperStepsValue(props.step)
  }
}
</script>
<style lang="scss">
$s_stepperStep__offsetSize: calc($s_spacer * 6);
$s_stepperStep__clientSize: calc($s_spacer * 3);

@mixin s_stepperStepCircle($size) {
  position: absolute;
  top: calc(($s_stepperStep__offsetSize - $size) / 2);
  left: 50%;
  width: $size;
  height: $size;
  content: '';
  transform: translateX(-50%);
}

.s_stepperStep {
  $stepperStep: &;
  position: relative;
  flex: 1;
  user-select: none;

  &__checkmark {
    @include s_stepperStepCircle($s_stepperStep__clientSize);
    fill: s_getPresetColor('primary', true);
  }

  &:not(#{$stepperStep}--visited) {
    #{$stepperStep}__checkmark {
      display: none;
    }
  }

  &::before {
    @include s_stepperStepCircle($s_stepperStep__offsetSize);
    @include s_borderRadius('circle');
    background-color: s_getAppColor('background');
    border: thin solid s_getAppColor('text');
  }

  &::after {
    position: absolute;
    top: calc($s_stepperStep__offsetSize / 2);
    left: calc(-1 * (50% - $s_stepperStep__offsetSize));
    width: calc(100% - $s_stepperStep__offsetSize * 2);
    height: 2px;
    content: '';
    background-color: s_getAppColor('border');
  }

  &:first-of-type::after {
    display: none;
  }

  &--editable {
    cursor: pointer;
  }

  &:focus-visible {
    @include s_focusRing();
  }

  &__content {
    padding-top: calc($s_stepperStep__offsetSize + $s_spacer * 2);
    padding-right: $s_spacer;
    padding-left: $s_spacer;
    font-size: 0.75rem;
    color: s_getAppColor('text');
    text-align: center;
  }

  // The circle shows the state in the primary colour; the text stays in the text colour, which reaches
  // 4.5:1 in both themes (primary text on the app background does not), and the current step is bold.
  &--current #{$stepperStep}__content {
    font-weight: 700;
  }

  &--visited,
  &--current {
    &#{$stepperStep}--disabled {
      #{$stepperStep}__content {
        color: s_getAppColor('disabled');
      }
    }

    &::after {
      background-color: s_getPresetColor('primary');
    }
  }

  &--visited {
    &::before {
      background-color: s_getPresetColor('primary');
      border: s_getPresetColor('primary');
    }
    &#{$stepperStep}--disabled {
      &::before {
        background-color: s_getAppColor('disabled');
      }
    }
  }

  &--current {
    &::before {
      background-color: s_getPresetColor('primary', true);
      border: calc(($s_stepperStep__offsetSize - $s_stepperStep__clientSize) / 2) solid s_getPresetColor('primary');
    }
  }

  &--disabled {
    #{$stepperStep}__content {
      color: s_getAppColor('disabled');
    }
  }
}
</style>
