import { faker } from '@khsura/shared'
import type { Meta } from '@storybook/vue3'
import { defineComponent } from 'vue'
import {
  SButton,
  SCard,
  SColumn,
  SContainer,
  SList,
  SListItem,
  SListItemContent,
  SListItemTitle,
  SMenu,
  SRow,
} from '~/index'
import { createStoryObj } from '~/storybook'

const menu: Meta<typeof SMenu> = {
  title: 'UI Components/Menu',
  argTypes: {
    location: {
      type: 'string',
      control: {
        type: 'select',
      },
      options: [null, 'top', 'right', 'bottom', 'left', 'top left', 'top right', 'bottom left', 'bottom right'],
    },
  },
}

export default menu

export const Menu = createStoryObj<typeof SMenu>({
  args: {
    closeOnClick: true,
    closeOnContentClick: true,
    closeOnScroll: true,
    offsetX: 0,
    offsetY: 0,
  },
  render: (args) =>
    defineComponent({
      components: {
        SMenu,
        SButton,
        SRow,
        SList,
        SListItem,
        SCard,
        SColumn,
        SListItemContent,
        SListItemTitle,
        SContainer,
      },
      setup() {
        const text = faker.lorem.paragraphs({ min: 3, max: 15 })

        return { args, text }
      },
      template: /* html */ `
        <SContainer>
          <SRow justify="spaceBetween">
            <SMenu v-bind="args">
              <template #activator="{ on, attrs }">
                <SButton v-on="on" v-bind="attrs" color="primary">Click Me 1</SButton>
              </template>
              <SList dense divided link>
                <SListItem>全て</SListItem>
                <SListItem>2022/10/11</SListItem>
                <SListItem>2022/10/12</SListItem>
              </SList>
            </SMenu>
            <SMenu v-bind="args" min-width="200">
              <template #activator="{ on, attrs }">
                <SButton v-on="on" v-bind="attrs">Click Me 2</SButton>
              </template>
              <SList dense divided link>
                <SListItem>
                  <SListItemContent>
                    <SListItemTitle>会員情報</SListItemTitle>
                  </SListItemContent>
                </SListItem>
                <SListItem>
                  <SListItemContent>
                    <SListItemTitle>入金</SListItemTitle>
                  </SListItemContent>
                </SListItem>
              </SList>
            </SMenu>
            </SRow>
            <SRow>
              <div v-html="text"></div>
            </SRow>
            <SRow justify="center">
            <SMenu v-bind="args">
              <template #activator="{ on, attrs }">
                <SButton v-on="on" v-bind="attrs" size="small" color="secondary">Click Me 3</SButton>
              </template>
              <SList dense divided link>
                <SListItem>
                  <SListItemContent>
                    <SListItemTitle>Item 1</SListItemTitle>
                  </SListItemContent>
                </SListItem>
                <SListItem>
                  <SListItemContent>
                    <SListItemTitle>Item 2</SListItemTitle>
                  </SListItemContent>
                </SListItem>
              </SList>
            </SMenu>
            </SRow>
            <SRow>
              <div v-html="text"></div>
            </SRow>
            <SRow justify="spaceBetween">
            <SMenu v-bind="args">
              <template #activator="{ on, attrs }">
                <SButton v-on="on" v-bind="attrs">Click Me 4</SButton>
              </template>
              <SCard>Hello</SCard>
            </SMenu>
            <SMenu v-bind="args" min-width="400">
              <template #activator="{ on, attrs }">
                <SButton v-on="on" v-bind="attrs">Click Me 5</SButton>
              </template>
              <SList>
                <SListItem>
                  <SListItemContent>
                    会員情報
                  </SListItemContent>
                </SListItem>
                <SListItem>
                  <SListItemContent>
                    入金
                  </SListItemContent>
                </SListItem>
              </SList>
            </SMenu>
          </SRow>
        </SContainer>
      `,
    }),
})
