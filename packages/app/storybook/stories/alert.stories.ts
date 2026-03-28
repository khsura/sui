import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { SAlert } from '@/app/index'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj, getSlot } from '@/app/storybook/helpers'

const alert: Meta<typeof SAlert> = {
  title: 'UI Components/Alert',
  component: SAlert,
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    dense: {
      control: { type: 'boolean' },
      type: { name: 'boolean', required: false },
    },
    fixedHeight: {
      control: { type: 'boolean' },
      type: { name: 'boolean', required: false },
    },
    minHeight: {
      control: { type: 'number' },
      type: { name: 'number', required: false },
    },
  },
}

export default alert

export const Alert = createStoryObj<typeof SAlert>({
  args: {
    color: undefined,
    size: null,
    fixedHeight: false,
    minHeight: undefined,
    default: 'This is an alert message.',
  },
  render: (args) =>
    defineComponent({
      components: { SAlert },
      setup() {
        return { args }
      },
      template: `
        <SAlert v-bind="args">
          ${'default' in args && getSlot(args.default)}
        </SAlert>
      `,
    }),
})
