import { SImageLoader, SForm, SButton } from '@sui/app'
import { createStoryObj } from '@sui/storybook/helpers'
import { action } from '@storybook/addon-actions'
import { defineComponent, ref } from 'vue'
import type { FormComponent } from '@sui/app'
import type { Meta } from '@storybook/vue3'
import type { Ref } from 'vue'

const imageLoader: Meta<typeof SImageLoader> = {
  title: 'UI Components/Form/ImageLoader',
}

export default imageLoader

export const ImageLoader = createStoryObj<typeof SImageLoader>({
  args: {
    id: 'sample',
    label: 'Upload',
    multiple: false,
    maxCount: 5,
    incremental: false,
    disabled: false,
    onChange: action('change'),
  },
  render: (args) => {
    return defineComponent({
      components: { SImageLoader, SForm, SButton },
      setup() {
        const form: Ref<FormComponent | null> = ref(null)
        const files = ref<File[] | null>(null)
        const error = ref(false)
        const maxLength = 3

        const rules = [
          (value: File[] | null) => {
            return (!!value && value.length > 0) || 'No images detected!'
          },
          (value: File[] | null) => {
            if (!!value && value.length > maxLength) {
              return `Please upload within ${maxLength} images`
            }

            return true
          },
          (value: File[] | null) => {
            if (!!value && !value.every((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type))) {
              return 'file extension must be one of the png, jpg or gif'
            }

            return true
          },
        ]

        return {
          files,
          rules,
          args,
          form,
          error,
        }
      },
      template: `
      <SForm ref="form" v-model:error="error">
          <SImageLoader v-bind="args" :rules="rules" v-model="files"></SImageLoader>
          <SButton @click="form.validate()">validate</SButton>
          <SButton @click="form.resetValidation()">reset</SButton>
          error: {{ error }}
          <div>
            Files: {{ files?.map((file, id) => file.name ?? 'noname' + id).join(',') }}
          </div>
      </SForm>`,
    })
  },
})
