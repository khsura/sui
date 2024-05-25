import { faker } from '@khsura/shared'
import { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage } from '@khsura/sui/components'
import { argsSlot, argsTag } from '@khsura/storybook/args'
import { argTypesSlot, argTypesTag } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'
import { defineComponent, ref } from 'vue'
import type { Meta } from '@storybook/vue3'

const cardSubtitle: Meta<typeof SCardSubtitle> = {
  title: 'UI Components/Card/CardSubtitle',
  argTypes: {
    ...argTypesTag(),
    ...argTypesSlot,
  },
  component: SCardSubtitle,
}

export default cardSubtitle

export const Subtitle = createStoryObj<typeof SCardSubtitle>({
  args: {
    ...argsTag(),
    ...argsSlot(),
  },
  render: (args) =>
    defineComponent({
      components: { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage },
      setup() {
        const title = ref(faker.lorem.sentences({ min: 0, max: 2 }))
        const text = ref(faker.lorem.paragraphs({ min: 0, max: 5 }))

        return {
          title,
          text,
          args,
        }
      },
      template: `
    <SCard max-width="500px" class="s_mx__auto">
      <SCardTitle v-if="title.trim()">
        {{ title }}
      </SCardTitle>
      <SCardSubtitle v-bind="args">
        ${args.default}
      </SCardSubtitle>
      <SCardText>
        {{ text }}
      </SCardText>
    </SCard>
  `,
    }),
})
