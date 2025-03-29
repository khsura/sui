import { faker } from '@khsura/shared'
import { STextarea } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref } from 'vue'
import { formInputModelValueRules } from '@khsura/storybook/configs'
import { createStoryObj } from '@khsura/storybook/helpers'

const textarea: Meta<typeof STextarea> = {
  title: 'UI Components/Form/Textarea',
}

export default textarea

export const Textarea = createStoryObj<typeof STextarea>({
  args: {
    resize: false,
    autogrow: true,
    dense: false,
    label: 'textarea',
    inputBackground: '',
    placeholderBackground: '',
    placeholder: '3 seconds later it will be updated',
  },
  parameters: {
    controls: {
      exclude: ['color', 'location'],
    },
  },
  render: (args) => {
    return defineComponent({
      components: {
        STextarea,
      },
      setup() {
        const modelValue = ref('')
        const rules = [formInputModelValueRules.required({ target: '本文' })]

        setTimeout(() => {
          modelValue.value = `${faker.lorem.paragraph(1)}\n${faker.lorem.paragraph(1)}\n${faker.lorem.paragraph(
            1,
          )}\n${faker.lorem.paragraph(1)}`
        }, 3000)

        return {
          modelValue,
          rules,
          args,
        }
      },
      template: /* html */ `
        <div>
          <STextarea id="textarea" v-bind="args" :rules="rules" v-model="modelValue"></STextarea>
          <pre>{{ modelValue }}</pre>
        </div>
    `,
    })
  },
})
