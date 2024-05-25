import { faker } from '@khsura/shared'
import {
  SExpansionPanel,
  SExpansionPanels,
  SExpansionPanelContent,
  SExpansionPanelHeader,
  SRow,
  SIcon,
  SColumn,
} from '@khsura/sui/components'
import { sizeProperties } from '@khsura/sui/configs'
import { createStoryObj } from '@khsura/storybook/helpers'
import { ref } from 'vue'
import type { Meta } from '@storybook/vue3'

const expansionPanels: Meta<typeof SExpansionPanels> = {
  title: 'UI Components/ExpansionPanels',
  argTypes: {
    expandIcon: {
      type: 'string',
    },
    expandIconSize: {
      type: 'string',
      control: {
        type: 'select',
      },
      options: sizeProperties,
    },
  },
}

export default expansionPanels

export const ExpansionPanels = createStoryObj<typeof SExpansionPanels>({
  args: {
    multiple: false,
    expandIcon: 'mdi-chevron-down',
    mandatory: false,
    expandIconSize: 'default',
  },
  render: (args) => ({
    components: {
      SExpansionPanel,
      SExpansionPanelContent,
      SExpansionPanelHeader,
      SExpansionPanels,
      SRow,
      SIcon,
      SColumn,
    },
    template: `
      <div>
        <SExpansionPanels v-bind="args" v-model="value">
          <SExpansionPanel :index="0">
            <SExpansionPanelHeader>
              <template #top>
                <span class="s_text--caption k_fontWeight__bold">${faker.company.buzzNoun()}</span>
              </template>
              <template #default="{ open }">
                <SRow no-gutters>
                  <SColumn>${faker.word.noun()}</SColumn>
                  <SColumn class="s_textColor__secondary">{{ open ? 'open' : '' }}</SColumn>
                </SRow>
              </template>
              <template #actions="{ isExpanded }">
                <SIcon :icon="args.expandIcon" size="large" :rotated="isExpanded"></SIcon>
              </template>
            </SExpansionPanelHeader>
            <SExpansionPanelContent>${faker.lorem.sentences({ min: 1, max: 3 })}</SExpansionPanelContent>
          </SExpansionPanel>
          <SExpansionPanel v-for="({ title, content }, i) in panels" :key="i + 1">
            <SExpansionPanelHeader>{{ title }}</SExpansionPanelHeader>
            <SExpansionPanelContent>{{ content }}</SExpansionPanelContent>
          </SExpansionPanel>
        </SExpansionPanels>
        <div class="s_pa__4">v-model: {{ value }}</div>
      </div>
    `,
    setup() {
      const value = ref<number[]>([0])

      const panels = [1, 2, 3].map(() => ({
        title: faker.commerce.productName(),
        content: faker.lorem.sentences({ min: 1, max: 3 }),
      }))

      return {
        value,
        args,
        panels,
      }
    },
  }),
})
