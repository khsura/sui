import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { sOverflowDemo } from '@/app/storybook/components'

const meta: Meta<typeof sOverflowDemo> = {
  title: 'Styles & Animations/Overflow',
  component: sOverflowDemo,
  argTypes: {
    overflowOne: {
      type: 'string',
      control: 'select',
      options: ['auto', 'hidden', 'visible'],
    },
    overflowTwo: {
      type: 'string',
      control: 'select',
      options: ['auto', 'hidden', 'visible'],
    },
    overflowThree: {
      type: 'string',
      control: 'select',
      options: ['auto', 'hidden', 'visible'],
    },
  },
}

export default meta
type Story = StoryObj<typeof sOverflowDemo>

export const Overflow: Story = {
  render: (args) => ({
    name: 'Overflow',
    components: { sOverflowDemo },
    setup() {
      return { args }
    },
    template: '<sOverflowDemo v-bind="args"></sOverflowDemo>',
  }),
}
