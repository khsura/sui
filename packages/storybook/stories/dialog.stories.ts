import { faker } from '@khsura/shared'
import {
  SMenu,
  SButton,
  SCard,
  SCardSubtitle,
  SCardText,
  SCardTitle,
  SContainer,
  SDialog,
  SIcon,
  SList,
  SListItem,
  SListItemContent,
  SSpacer,
} from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref } from 'vue'
import { argTypesElevation, argTypesLocation } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

const dialog: Meta<typeof SDialog> = {
  title: 'UI Components/Dialog',
  component: SDialog,
  argTypes: {
    ...argTypesLocation,
    ...argTypesElevation,
  },
}

export default dialog

export const BottomSheet = createStoryObj<typeof SDialog>({
  args: {
    persistent: false,
    scrollable: true,
    fullscreen: false,
    location: 'bottom',
  },
  render: (args) => {
    return defineComponent({
      components: {
        SDialog,
        SButton,
        SList,
        SListItem,
        SListItemContent,
      },
      setup() {
        const dialog = ref(false)

        const closeDialog = () => {
          dialog.value = false
        }

        return {
          dialog,
          closeDialog,
          args,
        }
      },
      template: `
      <div style="width: 100%;padding: 0.2rem 0.5rem;">
        <SDialog v-bind="args" v-model="dialog">
          <template #activator="{ on, attrs }">
            <SButton v-on="on" v-bind="attrs">select animal</SButton>
          </template>
          <SList link divided dense style="padding-left: 0;">
              <SListItem @click="dialog = false">
                <SListItemContent style="display: block;text-align: center;">
                  ${faker.animal.type()}
                </SListItemContent>
              </SListItem>
              <SListItem @click="dialog = false">
                <SListItemContent style="display: block;text-align: center;">
                  ${faker.animal.type()}
                </SListItemContent>
              </SListItem>
              <SListItem @click="dialog = false">
                <SListItemContent style="display: block;text-align: center;">
                  ${faker.animal.type()}
                </SListItemContent>
              </SListItem>
              <SListItem @click="dialog = false">
                <SListItemContent style="display: block;text-align: center;">
                  ${faker.animal.type()}
                </SListItemContent>
              </SListItem>
              <SListItem @click="dialog = false">
                <SListItemContent style="display: block;text-align: center;">
                  ${faker.animal.type()}
                </SListItemContent>
              </SListItem>
            </SList>
        </SDialog>
        </div>
      `,
    })
  },
})

export const Dialog = createStoryObj<typeof SDialog>({
  args: {
    persistent: false,
    scrollable: false,
    fullscreen: false,
    location: null,
  },
  render: (args) => {
    return defineComponent({
      components: {
        SDialog,
        SButton,
        SCard,
        SIcon,
        SSpacer,
        SCardTitle,
        SCardSubtitle,
        SCardText,
      },
      setup() {
        const dialog = ref(false)
        const title = ref(faker.commerce.productName())
        const subtitle = ref(faker.commerce.department())
        const text = ref(faker.commerce.productDescription())
        const paragraphs = ref(faker.lorem.paragraphs({ min: 5, max: 10 }).split('\n'))

        return {
          dialog,
          title,
          subtitle,
          text,
          args,
          paragraphs,
        }
      },
      template: /* html */ `
          <div v-for="(p, i) in paragraphs" :key="i">{{ p }}</div>
          <SDialog v-bind="args" v-model="dialog" max-width="400">
            <template #activator="{ on, attrs }">
              <SButton v-on="on" v-bind="attrs">
                <SIcon icon="mdi-movie-outline"></SIcon>Dialog
              </SButton>
            </template>
            <SCard>
              <SCardTitle>
                {{ title }}
                <SSpacer></SSpacer>
                <SButton variant="icon" size="mini" @click="dialog = false">
                  <SIcon icon="mdi-close"></SIcon>
                </SButton>
              </SCardTitle>
              <SCardSubtitle>{{ subtitle }}</SCardSubtitle>
              <SCardText :style="args.scrollable ? { height: '200px' } : {}">{{ text }}</SCardText>
            </SCard>
          </SDialog>
        `,
    })
  },
})

export const DialogWithNoActivator = createStoryObj<typeof SDialog>({
  args: {
    persistent: false,
    scrollable: false,
    fullscreen: false,
    location: null,
  },
  render: (args) => {
    return defineComponent({
      components: {
        SDialog,
        SButton,
        SCard,
        SIcon,
        SCardTitle,
        SCardSubtitle,
        SCardText,
      },
      setup() {
        const dialog = ref(false)
        const text = ref(faker.lorem.paragraphs({ min: 3, max: 5 }))

        return {
          dialog,
          args,
          text,
        }
      },
      template: `
          <SButton @click="dialog = true ">Outside Dialog Activator</SButton>
          <SDialog v-bind="args" v-model="dialog" max-width="400">
            <SCard>
              <SCardTitle>
                ${faker.commerce.product()}
                <SButton variant="icon" size="mini" @click="dialog = false">
                  <SIcon icon="mdi-close"></SIcon>
                </SButton>
              </SCardTitle>
              <SCardSubtitle>${faker.commerce.productDescription()}</SCardSubtitle>
              <SCardText :style="args.scrollable ? { height: '200px' } : {}">
                {{ text }}
              </SCardText>
            </SCard>
          </SDialog>
        `,
    })
  },
})

export const DoubleDialog = createStoryObj<typeof SDialog>({
  args: {
    persistent: false,
    scrollable: false,
    fullscreen: false,
  },
  render: (args) => {
    return defineComponent({
      components: {
        SDialog,
        SButton,
        SCard,
        SIcon,
        SCardTitle,
        SCardSubtitle,
        SCardText,
        SContainer,
      },
      setup() {
        const dialog1 = ref(false)

        const closeDialog1 = () => {
          dialog1.value = false
        }

        const dialog2 = ref(false)

        const closeDialog2 = () => {
          dialog2.value = false
        }

        return {
          dialog1,
          closeDialog1,
          dialog2,
          closeDialog2,
          args,
        }
      },
      template: `
      <SContainer>
        <SDialog v-bind="args" v-model="dialog1">
          <template #activator="{ on, attrs }">
            <SButton v-on="on" v-bind="attrs">
            <SIcon icon="mdi-movie-outline"></SIcon>
            Dialog 1
            </SButton>
          </template>
          <SCard>
            <SCardTitle>
              Hello Dialog 1
              <SButton variant="icon" size="mini" @click="closeDialog1">
                <SIcon icon="mdi-close"></SIcon>
              </SButton>
            </SCardTitle>
            <SCardSubtitle>Dialog 1 Subtitle</SCardSubtitle>
            <SCardText :style="args.scrollable ? { height: '200px' } : {}">
              Dialog Content 1
            </SCardText>
          </SCard>
        </SDialog>
        <SDialog v-bind="args" v-model="dialog2">
          <template #activator="{ on, attrs }">
            <SButton v-on="on" v-bind="attrs">
            <SIcon icon="mdi-movie-outline"></SIcon>
            Dialog 2
            </SButton>
          </template>
          <SCard>
            <SCardTitle>
              Hello Dialog 2
              <SButton variant="icon" size="mini" @click="closeDialog2">
                <SIcon icon="mdi-close"></SIcon>
              </SButton>
            </SCardTitle>
            <SCardSubtitle>Dialog 2 Subtitle</SCardSubtitle>
            <SCardText :style="args.scrollable ? { height: '200px' } : {}">
              Dialog 2 Content
            </SCardText>
          </SCard>
        </SDialog>
        </SContainer>
      `,
    })
  },
})

export const dialogWithMenu = createStoryObj<typeof SDialog>({
  render: (args) => {
    return defineComponent({
      components: { SDialog, SMenu, SButton, SCard, SCardText, SList },
      setup: () => {
        const dialogModel = ref(false)
        const menuModel = ref(false)

        return {
          args,
          dialogModel,
          menuModel,
        }
      },
      template: /* html */ `
        <SDialog v-bind="args" v-model="dialogModel">
          <template #activator="dialogActivator"><SButton v-on="dialogActivator.on">Open Dialog</SButton></template>
          <SCard>
            <SCardText>
              <SMenu v-model="menuModel" location="bottom">
                <template #activator="menuActivator"><SButton v-on="menuActivator.on">Open Menu</SButton></template>
                <SList>Menu Content</SList>
              </SMenu>
            </SCardText>
          </SCard>
        </SDialog>
      `,
    })
  },
})
