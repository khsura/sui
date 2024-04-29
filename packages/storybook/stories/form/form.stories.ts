import { SButton, SForm, SInput } from '@sui/app/components'
import { formInputModelValueRules } from '@sui/app/repositories'
import { createStoryObj } from '@sui/storybook/helpers'
import { action } from '@storybook/addon-actions'
import { defineComponent, ref, nextTick } from 'vue'
import type { FormComponent } from '@sui/app/definitions'
import type { Meta } from '@storybook/vue3'

const form: Meta<typeof SForm> = {
  title: 'UI Components/Form',
}

export default form

export const Form = createStoryObj<typeof SForm | { onSubmit: (event: Event) => void }>({
  render: (args) => {
    return defineComponent({
      components: {
        SForm,
        SInput,
        SButton,
      },
      setup() {
        const form = ref<FormComponent | null>(null)
        const email = ref('')
        const errors = ref<string[]>([])
        const error = ref(false)
        const valid = ref(true)
        const rules = [formInputModelValueRules.required({ target: 'email' })]

        const submit = async (event: Event) => {
          form.value?.validate()
          await nextTick()
          if ('onSubmit' in args) {
            args.onSubmit?.(event)
          }
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
