import { faker } from '@khsura/shared'
import { SButton, SCard, SCardActions, SCardSubtitle, SCardText, SCardTitle, SImage } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { argsCard } from '@khsura/storybook/args'
import {
  argTypesBorder,
  argTypesColor,
  argTypesElevation,
  argTypesMeasurableStyles,
  argTypesSlot,
} from '@khsura/storybook/argTypes'
import { createStoryObj, getSlot } from '@khsura/storybook/helpers'

const card: Meta<typeof SCard> = {
  title: 'UI Components/Card',
  component: SCard,
  argTypes: {
    ...argTypesBorder,
    ...argTypesColor,
    ...argTypesElevation,
    ...argTypesMeasurableStyles,
    ...argTypesSlot,
  },
  parameters: {
    controls: {
      sort: 'alpha',
    },
  },
}

export default card

const components = { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage }

export const Card = createStoryObj<typeof SCard>({
  args: argsCard({
    default: () => /* html */ `
      <SCardTitle>
        ${faker.lorem.sentence()}
      </SCardTitle>
      <SCardSubtitle>
        ${faker.lorem.sentences(2)}
      </SCardSubtitle>
      <SCardText>
        ${faker.lorem.paragraph()}
      </SCardText>
      <SCardActions>
        <SButton color="primary">Add To Favorites</SButton>
        <SButton size="small" text class="s_ml__2">Back</SButton>
      </SCardActions>`,
  }),
  render: (args) =>
    defineComponent({
      components,
      setup() {
        return {
          args,
          image: faker.image.urlLoremFlickr(),
        }
      },
      template: `
        <SCard v-bind="args" max-width="500px" class="s_mx__auto">
          ${getSlot(args.default)}
        </SCard>
      `,
    }),
})

export const CardWithImage = createStoryObj<typeof SCard>({
  args: argsCard({
    default: () => /* html */ `
      <SCardTitle>
        ${faker.commerce.product()}
      </SCardTitle>
      <SCardSubtitle>
        <span class="s_fontWeight__bold">「${faker.commerce.department()}」</span>
      </SCardSubtitle>
      <SCardText>
        ${faker.commerce.productDescription()}
      </SCardText>
      <SCardActions>
        <SButton color="primary">${faker.word.verb()}</SButton>
        <SButton size="small" text class="s_ml__2">${faker.word.verb()}</SButton>
      </SCardActions>
    `,
  }),
  render: (args) =>
    defineComponent({
      components,
      setup() {
        return {
          args,
        }
      },
      template: `
        <SCard v-bind="args" max-width="500px" class="s_mx__auto">
          <SImage src="${faker.image.urlLoremFlickr()}" alt="deep impact" max-height="225px"></SImage>
          ${getSlot(args.default)}
        </SCard>
      `,
    }),
})
