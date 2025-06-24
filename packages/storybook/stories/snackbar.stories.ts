import { SSnackbar, SButton } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const snackbar: Meta<typeof SSnackbar> = {
  title: 'UI Components/Snackbar',
  argTypes: {
    default: {
      description: "Snackbar's content",
      control: { type: 'text' },
    },
    location: {
      control: { type: 'select' },
      description: 'by default it will be displayed in bottom',
      options: [null, 'bottom', 'top'],
    },
    multiLine: {
      description:
        'The multi-line property extends the height of the SSnackbar to give you a bit more room for content.',
    },
    timeout: {
      description: 'The timeout property lets you customize the delay before the SSnackbar is hidden.',
    },
    activator: { description: 'Element that causing activation of snackbar' },
  },
}

export default snackbar

export const Snackbar = createStoryObj<typeof SSnackbar>({
  render: (args) => {
    return {
      components: { SSnackbar, SButton },
      setup() {
        const model = ref(false)

        return { args, model }
      },
      template: /* html */ `
      <div>
        model: {{ model }}
        <SSnackbar v-bind="args" v-model="model">
          <template #activator="{ on, attrs }">
            ${args.activator}
          </template>
          ${args.default}
        </SSnackbar>
      </div>
      `,
    }
  },
  args: {
    multiLine: false,
    default: 'I am a multi-line snackbar. I can have more than one line. This is another line that is quite long.',
    timeout: 6000,
    location: null,
    activator: '<SButton v-on="on" v-bind="attrs" color="primary">snackbar</SButton>',
  },
})

export const SnackbarWithAction = createStoryObj<typeof SSnackbar>({
  render: (args) => {
    return {
      components: { SSnackbar, SButton },
      setup() {
        const model = ref(false)

        return { args, model }
      },
      template: /* html */ `
      <div>
        model: {{ model }}
        <SSnackbar v-bind="args" v-model="model">
          <template #activator="{ on, attrs }">
            ${args.activator}
          </template>
          ${args.default}
          <template #action>
            <SButton text color="error" size="small" @click="model = false">Close</SButton>
          </template>
        </SSnackbar>
      </div>
      `,
    }
  },
  args: {
    multiLine: false,
    default: 'I am a multi-line snackbar. I can have more than one line. This is another line that is quite long.',
    timeout: 6000,
    location: null,
    activator: '<SButton v-on="on" v-bind="attrs" color="info">snackbar</SButton>',
  },
})
