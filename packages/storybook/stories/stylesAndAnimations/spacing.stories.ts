import { sSpacingDemo } from '@khsura/storybook/components'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof sSpacingDemo> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Styles & Animations/Spacing',
  component: sSpacingDemo,
  argTypes: {
    marginDirection: {
      type: 'string',
      control: 'select',
      options: ['a', 'x', 'y', 't', 'r', 'b', 'l'],
    },
    paddingDirection: {
      type: 'string',
      control: 'select',
      options: ['a', 'x', 'y', 't', 'r', 'b', 'l'],
    },
    marginSize: {
      type: 'number',
      control: 'select',
      options: [...new Array(11).fill(0).map((_, i) => i)],
    },
    paddingSize: {
      type: 'number',
      control: 'select',
      options: [...new Array(11).fill(0).map((_, i) => i)],
    },
  },
}

export default meta
type Story = StoryObj<typeof sSpacingDemo>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const SpacingDemo: Story = {
  render: (args) => ({
    name: 'Spacing',
    components: { sSpacingDemo },
    setup() {
      return { args }
    },
    template: '<sSpacingDemo v-bind="args"></sSpacingDemo>',
  }),
}
