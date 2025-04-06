<template>
  <div :class="classList">
    <slot :value="modelValue">
      <template v-for="(item, id) in items" :key="id">
        <SStepperStep :step="item.step" :editable="item.editable ?? false" :name="id">{{ item.text }}</SStepperStep>
      </template>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ProviderName, ProviderPropsName } from '@khsura/sui/constants'
import type { PropsStepper } from '@khsura/sui/definitions'
import { useProviderService } from '@khsura/sui/services'
import SStepperStep from './sStepperStep.vue'

const props = withDefaults(defineProps<PropsStepper>(), {
  items: () => [],
})

const emit = defineEmits<(event: 'update:modelValue', value: number) => void>()
const { provideProps, provide } = useProviderService()

const classList = computed(() => {
  return {
    s_stepper: true,
    's_stepper--shrink': props.shrink,
  }
})

const steps = ref<number[]>([])
const firstStep = computed(() => steps.value[0] ?? 0)
const lastStep = computed(() => steps.value[steps.value.length - 1] ?? 0)

provideProps(ProviderPropsName.stepperProps, props)

provide(ProviderName.stepperUpdateValue, (value: number) => {
  emit('update:modelValue', Math.min(Math.max(value, firstStep.value), lastStep.value))
})

provide(ProviderName.stepperRegisterStepperStep, (step: number) => {
  steps.value = [...new Set([...steps.value, step])].sort((a, b) => a - b)
})

provide(ProviderName.stepperUnregisterStepperStep, (step) => {
  const index = steps.value.indexOf(step)

  if (index > -1) {
    steps.value.splice(index, 1)
  }
})

provide(
  ProviderName.stepperSteps,
  computed(() => steps.value.length),
)
</script>
<style lang="scss">
.s_stepper {
  padding-left: 0;
  list-style: none;
  counter-reset: step;

  &:not(&--shrink) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &--shrink {
    display: inline-flex;
  }

  .s_divider:last-child {
    display: none;
  }
}
</style>
