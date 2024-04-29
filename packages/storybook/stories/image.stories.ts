import { faker } from '@sui/shared'
import { SImage, SRow } from '@sui/app/components'
import { createStoryObj } from '@sui/storybook/helpers'
import type { Meta } from '@storybook/vue3'

const image: Meta<typeof SImage> = {
  title: 'UI Components/Image',
}

export default image

export const Image = createStoryObj<typeof SImage>({
  render: (args) => {
    return {
      components: { SImage, SRow },
      setup() {
        return { args }
      },
      template: /* html */ `
      <SImage v-bind="args" v-on="args">
        <SRow
          fill-height
          align="center"
          justify="center"
          class="s_textColor__background k_text--h4 k_fontWeight__bold"
          style="text-transform: uppercase;"
        >
          <span class="s_textShadow__3">{{ args.default }}</span>
        </SRow>
      </SImage>
      `,
    }
  },
  args: {
    default: faker.lorem.words({ max: 5, min: 2 }),
    src: faker.image.url(),
    alt: 'logo',
    width: 400,
    height: 300,
    objectFit: 'cover',
  },
})
