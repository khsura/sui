import { SRow, SSpacer, SColumn } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { createStoryObj } from '@khsura/storybook/helpers'

const spacer: Meta<typeof SSpacer | typeof SColumn> = {
  title: 'UI Components/Grids/Spacer',
  argTypes: {
    cols: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
  },
}

export default spacer

export const Spacer = createStoryObj<typeof spacer>({
  render: (args) => {
    return {
      template: /* html */ `        
      <SRow v-bind="args" align="center" class="s_textAlign__center">
        <SColumn cols="2">cols = 1</SColumn>
        <SSpacer class="s_backgroundColor__warning">spacer</SSpacer>
        <SColumn v-bind="args">cols = {{ args.cols }}</SColumn>
      </SRow>
      `,
      components: { SRow, SColumn, SSpacer },
      setup() {
        return { args }
      },
    }
  },
  args: {
    cols: 3,
  },
})
