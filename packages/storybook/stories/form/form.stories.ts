import { SButton, SForm, SInput } from '@khsura/sui/index'
import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref, nextTick } from 'vue'
import { formInputModelValueRules } from '@khsura/storybook/configs'
import { createStoryObj } from '@khsura/storybook/helpers'
import type { ComponentPublicInstance } from 'vue'

const form: Meta<typeof SForm> = {
  title: 'UI Components/Form',
}

export default form

export const Form = createStoryObj<{ onSubmit: (event: Event) => void }>({
  render: (args) => {
    return defineComponent({
      components: {
        SForm,
        SInput,
        SButton,
      },
      setup() {
        const form = ref<(ComponentPublicInstance & { validate: () => void; resetValidation: () => void }) | null>(null)
        const email = ref('')
        const errors = ref<string[]>([])
        const error = ref(false)
        const valid = ref(true)
        const rules = [formInputModelValueRules.required({ target: 'email' })]

        const submit = async (event: Event) => {
          form.value?.validate()
          await nextTick()
          args.onSubmit?.(event)
        }

        const reset = () => {
          form.value?.resetValidation()
        }

        return {
          form,
          email,
          error,
          errors,
          valid,
          rules,
          reset,
          args,
          submit,
        }
      },
      template: `
      <SForm ref="form" class="s_pa__3" v-bind="args" v-model="valid" v-model:error="error" v-model:errors="errors" @submit.prevent="submit">
        <SInput id="email" v-model="email" :rules="rules" type="email" label="email" placeholder="sura.kh@surakh.com"></SInput>
        <SButton type="submit" :disabled="error" color="primary">submit</SButton>
        <SButton @click="reset" text class="s_ml__2">reset</SButton>
      </SForm>
      `,
    })
  },
  args: {
    onSubmit: action('submit'),
  },
})
