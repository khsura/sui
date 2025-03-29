import { SCheckbox, SForm } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref } from 'vue'
import { argTypesColor } from '@khsura/storybook/argTypes'
import { formInputModelValueRules } from '@khsura/storybook/configs'
import { createStoryObj, getSlot } from '@khsura/storybook/helpers'

const checkbox: Meta<typeof SCheckbox> = {
  title: 'UI Components/Form/Checkbox',
  component: SCheckbox,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'large'],
    },
    ...argTypesColor,
  },
}

export default checkbox

const formSlot = () => /* html */ `
  <div class="s_pa__3">
  <div class="s_text--caption">Form value: {{ formValue }}</div>
  <div class="s_text--caption">Form error: {{ formError }}</div>
  <div class="s_text--caption">Form errors: {{ formErrors }}</div>
</div>
`

export const OptionalCheckbox = createStoryObj<typeof SCheckbox>({
  args: {
    size: 'default',
    block: false,
    bordered: false,
    color: undefined,
    hideDetails: false,
  },
  parameters: {
    controls: {
      exclude: ['label'],
    },
  },
  render: (args) =>
    defineComponent({
      components: { SCheckbox, SForm },
      setup() {
        const selecteds = ref({
          success: false,
          primary: false,
          warning: false,
          info: false,
        })

        return {
          selecteds,
          args,
        }
      },
      template: `
        <div class="s_pa__3">
          <SCheckbox
            v-for="(selected, key) in selecteds" :key="key"
            v-bind="args"
            :id="key"
            :label="key"
            :color="key"
            v-model="selecteds[key]"
            class="s_px__2"
          ></SCheckbox>
        </div>
      `,
    }),
})

export const RequiredCheckbox = createStoryObj<typeof SCheckbox>({
  args: {
    label: 'Accept',
    size: 'default',
    block: false,
    bordered: false,
    color: undefined,
    hideDetails: false,
  },
  render: (args) =>
    defineComponent({
      components: { SCheckbox, SForm },
      setup() {
        const formValue = ref(true)
        const formError = ref<boolean>(false)
        const formErrors = ref<string[]>([])
        const isSelected = ref<boolean>(false)

        return {
          formValue,
          formError,
          isSelected,
          formErrors,
          rules: [formInputModelValueRules.required({ target: 'Accept' })],
          args,
        }
      },
      template: `
        <SForm
          v-model="formValue"
          v-model:error="formError"
          v-model:errors="formErrors"
          @submit.prevent
        >
          <SCheckbox
          class="s_pa__3"
          id="agreementCheckbox"
          v-bind="args"
          v-model="isSelected"
          :rules="rules"
          ></SCheckbox>
          ${getSlot(formSlot)}
        </SForm>
      `,
    }),
})
