import { STab, STabs } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const tab: Meta<typeof STabs> = {
  title: 'UI Components/Tabs',
  argTypes: {
    selectedTabColor: {
      control: {
        type: 'color',
      },
    },
  },
  args: {
    outlined: false,
    rounded: false,
    tile: false,
    dense: false,
    bordered: false,
    shrink: false,
    selectedTabColor: 'primary',
  },
}

export default tab

export const Tab = createStoryObj<typeof STabs>({
  render: (args) => {
    return {
      components: {
        STab,
        STabs,
      },
      setup() {
        const tab1 = ref(1)
        const tab2 = ref(1)

        return {
          tab1,
          tab2,
          args,
        }
      },
      template: /* html */ `
      <div>
        <h3>Tabs without column control</h3>
        <STabs
          v-model="tab1"
          :outlined="args.outlined"
          :rounded="args.rounded"
          :tile="args.tile"
          :dense="args.dense"
          :bordered="args.bordered"
          :selected-tab-color="args.selectedTabColor"
          :shrink="args.shrink"
        >
          <STab :tab="0">Tab1</STab>
          <STab :tab="1">Tab2</STab>
          <STab :tab="2">Tab3</STab>
          <STab :tab="3">Tab4</STab>
          <STab :tab="4" disabled>Tab5</STab>
        </STabs>
        <h3 class="s_mt__5">Tabs with column control</h3>
        <STabs
          v-model="tab2"
          :outlined="args.outlined"
          :rounded="args.rounded"
          :tile="args.tile"
          :dense="args.dense"
          :bordered="args.bordered"
          :selected-targs.ab-color="args.selectedTabColor"
          :shrink="args.shrink"
        >
          <STab :tab="0" cols="4" sm="grow">Tab1</STab>
          <STab :tab="1" cols="4" sm="grow">Tab2</STab>
          <STab :tab="2" cols="4" sm="grow">Tab3</STab>
          <STab :tab="3" cols="6" sm="grow">Tab4</STab>
          <STab :tab="4" cols="6" sm="grow" disabled>Tab5</STab>
        </STabs>
      </div>
      `,
    }
  },
})
