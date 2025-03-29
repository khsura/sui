import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { SRow, SSpacer, SColumn } from '~/index'
import { createStoryObj } from '~/storybook'

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
      <SRow v-bind="args" :cols="cols" align="center" class="s_textAlign__center">
        <SColumn cols="2">cols = 1</SColumn>
        <SSpacer class="s_backgroundColor__warning">spacer take {{ 11 - args.cols }} cols</SSpacer>
        <SColumn v-bind="args">cols = {{ args.cols }}</SColumn>
      </SRow>
      `,
      components: { SRow, SColumn, SSpacer },
      setup() {
        const cols = ref(3)

        return { args, cols }
      },
    }
  },
})
