import { faker } from '@khsura/shared'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { SCard, SCardTitle, SCardText, SButton, SCardActions, SCardSubtitle, SImage } from '@/app/index'
import { argsSlot, argsTag } from '@/app/storybook/args'
import { argTypesSlot, argTypesTag } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const cardTitle: Meta<typeof SCardTitle> = {
  title: 'UI Components/Card/CardTitle',
  argTypes: {
    ...argTypesTag(),
    ...argTypesSlot,
  },
  component: SCardTitle,
}

export default cardTitle

export const Title = createStoryObj<typeof SCardTitle>({
  args: {
    ...argsTag(),
    ...argsSlot(),
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
      <SCardTitle v-bind="args">
        ${args.default}
      </SCardTitle>
      <SCardSubtitle>
        ${faker.lorem.sentences({ min: 0, max: 6 })}
      </SCardSubtitle>
      <SCardText>
        ${faker.lorem.paragraphs({ min: 1, max: 5 })}
      </SCardText>
    </SCard>
  `,
    }),
})
