import { faker } from '@sui/shared'
import { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage } from '@sui/app/components'
import { argsSlot, argsTag } from '@sui/storybook/args'
import { argTypesSlot, argTypesTag } from '@sui/storybook/argTypes'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent } from 'vue'
import type { Meta } from '@storybook/vue3'

const cardText: Meta<typeof SCardText> = {
  title: 'UI Components/Card/CardText',
  argTypes: {
    ...argTypesTag(),
    ...argTypesSlot,
  },
  component: SCardText,
}

export default cardText

export const Text = createStoryObj<typeof SCardText>({
  args: {
    ...argsTag(),
    ...argsSlot(faker.lorem.paragraphs({ min: 1, max: 3 })),
  },
  render: (args) =>
    defineComponent({
      components: { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage },
      setup() {
        return {
          args,
        }
      },
      template: `
    <SCard max-width="500px" class="s_mx__auto">
      <SCardTitle>
        ${faker.lorem.sentence({ min: 0, max: 2 })}
      </SCardTitle>
      <SCardSubtitle>
        ${faker.lorem.sentences({ min: 0, max: 6 })}
      </SCardSubtitle>
      <SCardText v-bind="args">
        ${args.default}
      </SCardText>
    </SCard>
  `,
    }),
})
