import { SStepper, SStepperStep, SRow, SButton } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const stepper: Meta<typeof SStepper> = {
  title: 'UI Components/Stepper',
}

export default stepper

export const StepperWithProps = createStoryObj<typeof SStepper>({
  render: (args) => {
    return {
      components: { SStepper, SStepperStep, SRow, SButton },
      setup() {
        const step = ref(1)

        return {
          step,
          args,
        }
      },
      template: /* html */ `
      <div>
        <SStepper v-bind="args" v-model="step"></SStepper>
        <SRow align="center">
          <SButton @click="step -= 1" size="small">previous step</SButton>
          {{ step }}
          <SButton @click="step += 1" size="small">next step</SButton>
        </SRow>
      </div>
      `,
    }
  },
  args: {
    shrink: false,
    items: [
      { step: 1, text: 'Step1' },
      { step: 2, text: 'Step2' },
      { step: 3, text: 'Step3' },
      { step: 4, text: 'Step4' },
      { step: 5, text: 'Step5' },
    ],
  },
})

export const StepperWithSlots = createStoryObj<typeof SStepper>({
  render: (args) => {
    return {
      components: { SStepper, SStepperStep, SRow, SButton },
      setup() {
        const step = ref(1)

        return {
          step,
          args,
        }
      },
      template: /* html */ `
      <div>
        <SStepper v-bind="args" :shrink="args.shrink" v-model="step">
          <SStepperStep :step="1" :editable="step > 1 && step !== 5">Step1</SStepperStep>
          <SStepperStep :step="2" :editable="step > 2 && step !== 5" disabled>Step2</SStepperStep>
          <SStepperStep :step="3" :editable="step > 3 && step !== 5">Step3</SStepperStep>
          <SStepperStep :step="4" :editable="step > 4 && step !== 5" disabled>Step4</SStepperStep>
          <SStepperStep :step="5">Step5</SStepperStep>
        </SStepper>
        <SRow align="center">
          <SButton @click="step -= 1" size="small">previous step</SButton>
          {{ step }}
          <SButton @click="step += 1" size="small">next step</SButton>
        </SRow>
      </div>
      `,
    }
  },
  args: {
    shrink: false,
  },
})
