import {
  SButton,
  SIcon,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemGroup,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SSubheader,
} from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { argsColor, argsMeasurableStyles } from '@khsura/storybook/args'
import { argTypesMeasurableStyles } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

const list: Meta<typeof SList> = {
  title: 'UI Components/List',
  argTypes: {
    ...argTypesMeasurableStyles,
    lines: {
      control: {
        type: 'number',
      },
    },
  },
}

export default list

export const List = createStoryObj<typeof SList>({
  render: (args) => {
    return {
      components: {
        SList,
        SListItem,
        SListItemGroup,
        SListItemContent,
        SListItemIcon,
        SListItemAction,
        SIcon,
        SListItemTitle,
        SListItemSubtitle,
        SSubheader,
      },
      setup() {
        return { args }
      },
      template: /* html */ `
      <SList v-bind="args" class="s_mx__auto">
        <SSubheader>User Info</SSubheader>
        <SListItem>
          <SListItemContent>
            <SListItemTitle>Name</SListItemTitle>
            <SListItemSubtitle>Sura Kh</SListItemSubtitle>
          </SListItemContent>
        </SListItem>
        <SListItem>
          <SListItemContent>
            <SListItemTitle>Birthday</SListItemTitle>
            <SListItemSubtitle>1970年1月11日</SListItemSubtitle>
          </SListItemContent>
        </SListItem>
        <SListItem>
          <SListItemContent>
            <SListItemTitle>Sex</SListItemTitle>
            <SListItemSubtitle>Male</SListItemSubtitle>
          </SListItemContent>
        </SListItem>
        <SListItem>
          <SListItemContent>
            <SListItemTitle>More Info</SListItemTitle>
            <SListItemSubtitle>settings</SListItemSubtitle>
          </SListItemContent>
          <SListItemAction align-center>
            <SIcon icon="mdi-account"></SIcon>
          </SListItemAction>
        </SListItem>
        <SListItemGroup title="group">
          <SListItem>
            <SListItemContent>
              <SListItemSubtitle>Group Item 1</SListItemSubtitle>
            </SListItemContent>
            <SListItemAction>
              10,000$
            </SListItemAction>
          </SListItem>
          <SListItem>
            <SListItemContent>
              <SListItemSubtitle>Group Item 2</SListItemSubtitle>
            </SListItemContent>
            <SListItemAction>
              10,000$
            </SListItemAction>
          </SListItem>
        </SListItemGroup>
      </SList>
      `,
    }
  },
  args: {
    ...argsMeasurableStyles,
    divided: false,
    lines: null,
    outlined: false,
    dense: false,
    link: false,
    inset: false,
  },
})

export const ListColors = createStoryObj<typeof SList>({
  render: (args) => {
    return {
      components: {
        SList,
        SListItem,
        SListItemContent,
        SListItemIcon,
        SIcon,
        SListItemTitle,
        SListItemSubtitle,
        SListItemAction,
        SButton,
      },
      setup() {
        return { args }
      },
      template: /* html */ `
      <SList v-bind="args" class="s_mx__auto">
        <SListItem>
          <SListItemIcon>
            <SIcon icon="mdi-account"></SIcon>
          </SListItemIcon>
          <SListItemContent>
            Hello
          </SListItemContent>
        </SListItem>
        <SListItem disabled>
          <SListItemIcon>
            <SIcon icon="mdi-pencil"></SIcon>
          </SListItemIcon>
          <SListItemTitle>Hello</SListItemTitle>
        </SListItem>
        <SListItem>
          <SListItemIcon>
            <SIcon icon="mdi-account"></SIcon>
          </SListItemIcon>
          <SListItemContent>
            <SListItemTitle>Brunch this weekend?</SListItemTitle>
            <SListItemSubtitle>Ali Connors — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?</SListItemSubtitle>
          </SListItemContent>
          <SListItemIcon>
            <SIcon icon="mdi-facebook"></SIcon>
          </SListItemIcon>
        </SListItem>
        <SListItem>
          <SListItemIcon>
            <SIcon icon="mdi-account"></SIcon>
          </SListItemIcon>
          <SListItemContent>
            <SListItemTitle>Brain</SListItemTitle>
            <SListItemSubtitle>Sugar</SListItemSubtitle>
          </SListItemContent>
          <SListItemAction>
            <SButton>info</SButton>
          </SListItemAction>
        </SListItem>
      </SList>
    `,
    }
  },
  args: {
    ...argsMeasurableStyles,
    divided: false,
    lines: null,
    dense: false,
    link: false,
    text: false,
    outlined: false,
    ...argsColor,
  },
})

export const ListRandom = createStoryObj<typeof SList>({
  render: (args) => {
    return {
      components: {
        SList,
        SListItem,
        SListItemContent,
        SListItemIcon,
        SIcon,
        SListItemTitle,
        SListItemSubtitle,
        SListItemAction,
        SButton,
      },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SList v-bind="args" class="s_mx__auto">
          <SListItem>
            <SListItemIcon>
              <SIcon icon="mdi-account"></SIcon>
            </SListItemIcon>
            <SListItemContent>
              Hello
            </SListItemContent>
          </SListItem>
          <SListItem disabled>
            <SListItemIcon>
              <SIcon icon="mdi-pencil"></SIcon>
            </SListItemIcon>
            <SListItemTitle>Hello</SListItemTitle>
          </SListItem>
          <SListItem>
            <SListItemIcon>
              <SIcon icon="mdi-account"></SIcon>
            </SListItemIcon>
            <SListItemContent>
              <SListItemTitle>Brunch this weekend?</SListItemTitle>
              <SListItemSubtitle>Ali Connors — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?</SListItemSubtitle>
            </SListItemContent>
            <SListItemIcon>
              <SIcon icon="mdi-facebook"></SIcon>
            </SListItemIcon>
          </SListItem>
          <SListItem>
            <SListItemIcon>
              <SIcon icon="mdi-account"></SIcon>
            </SListItemIcon>
            <SListItemContent>
              <SListItemTitle>Brain</SListItemTitle>
              <SListItemSubtitle>Sugar</SListItemSubtitle>
            </SListItemContent>
            <SListItemAction>
              <SButton>info</SButton>
            </SListItemAction>
          </SListItem>
        </SList>
      `,
    }
  },
  args: {
    ...argsMeasurableStyles,
    divided: false,
    lines: null,
    outlined: false,
    dense: false,
    link: false,
  },
})
