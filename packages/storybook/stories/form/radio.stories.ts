import { faker } from '@khsura/shared'
import { SForm, SRadioGroup, SRadio, SImage } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref } from 'vue'
import { argsRadioGroup } from '@khsura/storybook/args'
import { formInputModelValueRules } from '@khsura/storybook/configs'
import { createStoryObj } from '@khsura/storybook/helpers'

const radio: Meta<typeof SRadioGroup> = {
  title: 'UI Components/Form/Radio',
}

export default radio

export const Radio = createStoryObj<typeof SRadioGroup>({
  args: {
    ...argsRadioGroup,
  },
  render: (args) =>
    defineComponent({
      components: {
        SForm,
        SRadioGroup,
        SRadio,
      },
      setup() {
        const modelValue = ref<string | null>(null)
        const rules = [formInputModelValueRules.select({ target: '取引銀行' })]
        const errors = ref([])
        const error = ref(false)

        return {
          modelValue,
          rules,
          errors,
          error,
          args,
        }
      },
      template: `
        <SForm @submit.prevent v-model:errors="errors" v-model:error="error">
          <SRadioGroup
            id="radioGroup"
            name="radioGroup"
            v-bind="args"
            v-model="modelValue"
          >
            <SRadio id="sample" value="sample" label="sample"></SRadio>
            <SRadio id="sample2" value="sample2" label="sample2"></SRadio>
          </SRadioGroup>
          <div>
            modelValue: {{ modelValue ?? 'null' }}
          </div>
        </SForm>
      `,
    }),
})

export const RadioBoolean = createStoryObj<typeof SRadioGroup>({
  args: {
    ...argsRadioGroup,
  },
  render: (args) =>
    defineComponent({
      components: {
        SForm,
        SRadioGroup,
        SRadio,
      },
      setup() {
        const modelValue = ref<string | null>(null)
        const rules = [formInputModelValueRules.select({ target: '取引銀行' })]
        const errors = ref([])
        const error = ref(false)

        return {
          modelValue,
          rules,
          errors,
          error,
          args,
        }
      },
      template: `
        <SForm @submit.prevent v-model:errors="errors" v-model:error="error">
          <SRadioGroup
            id="radioGroup"
            v-model="modelValue"
            name="radioGroup"
            v-bind="args"
          >
            <SRadio id="shouldReceiveMail" :value="true" label="required"></SRadio>
            <SRadio id="doNotReceiveMail" :value="false" label="not required"></SRadio>
          </SRadioGroup>
          {{ modelValue ?? 'null' }}
        </SForm>
      `,
    }),
})

export const RadioWithIcon = createStoryObj<typeof SRadioGroup>({
  args: {
    ...argsRadioGroup,
  },
  render: (args) =>
    defineComponent({
      components: {
        SForm,
        SRadioGroup,
        SImage,
        SRadio,
      },
      setup() {
        const modelValue = ref<string | null>(null)
        const rules = [formInputModelValueRules.select({ target: '取引銀行' })]
        const errors = ref([])
        const error = ref(false)

        return {
          modelValue,
          rules,
          errors,
          error,
          args,
          image: faker.image.avatar(),
        }
      },
      template: `
        <SForm @submit.prevent v-model:errors="errors" v-model:error="error">
          <SRadioGroup
            id="radioGroup"
            name="radioGroup"
            v-model="modelValue"
            v-bind="args"
          >
            <SRadio id="sample" value="sample" label="sample">
              <template #label="{ attrs }">
                <span v-bind="attrs">
                  <SImage
                    :src="image"
                    alt="sample"
                    height="20"
                    object-fit="contain"
                  ></SImage>
                </span>
              </template>
            </SRadio>
            <SRadio id="sample2" value="sample2" label="sample2"></SRadio>
          </SRadioGroup>
          <div>modelValue: {{ modelValue ?? 'null' }}</div>
        </SForm>
      `,
    }),
})
