import { SRow, SCard, SColumn } from '@sui/app/components'
import { gridAlignProperties, gridJustifyProperties } from '@sui/app/configs'
import { createStoryObj } from '@sui/storybook/helpers'
import type { Meta } from '@storybook/vue3'

const grids: Meta<typeof SRow> = {
  title: 'UI Components/Grids/Row',
  argTypes: {
    align: {
      options: gridAlignProperties,
      control: { type: 'select' },
    },
    justify: {
      options: gridJustifyProperties,
      control: { type: 'select' },
    },
    noGutters: {
      type: { name: 'string', required: false },
      description: 'Removes default margins around elements',
      control: {
        type: 'boolean',
      },
    },
  },
}

export default grids

export const Row = createStoryObj<typeof SRow>({
  render: (args) => {
    return {
      template: /* html */ `        
      <SRow style="border: 1px solid black; height: 120px" v-bind="args">        
        <SCard
          v-for="i in 4" :key="i"
          max-width="100px"
          outlined
          :style="variableHeight()"
          class="s_ma__1 k_textAlign__center"
        >
          {{ i }}
        </SCard>
      </SRow>
      `,
      components: { SRow, SCard, SColumn },
      setup() {
        const variableHeight = () => ({ 'min-height': `${40 + Math.random() * 30}px` })

        return {
          args,
          variableHeight,
        }
      },
    }
  },
  args: {
    noGutters: false,
  },
})
